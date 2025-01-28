// src/lib/excelUtils.js
import ExcelJS from 'exceljs';

export const EXPECTED_COLUMNS = {
  web: ['date', 'site', 'page', 'visits', 'newLovers'],
  social: ['date', 'platform', 'followers', 'views', 'interactions'],
  media: ['date', 'platform', 'spend', 'reach', 'ctr', 'cpc']
};

export const processExcelFile = async (file) => {
  const workbook = new ExcelJS.Workbook();
  
  try {
    await workbook.xlsx.load(await file.arrayBuffer());
    const results = {};
    
    workbook.eachSheet((worksheet, sheetId) => {
      const sheetData = [];
      const headers = worksheet.getRow(1).values.slice(1);
      
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        
        const rowData = {};
        row.values.slice(1).forEach((value, index) => {
          let processedValue = value;
          if (value instanceof Date) {
            processedValue = value.toISOString().split('T')[0];
          } else if (value?.result) {
            processedValue = value.result;
          }
          rowData[headers[index]] = processedValue;
        });
        
        sheetData.push(rowData);
      });
      
      results[worksheet.name] = sheetData;
    });
    
    return results;
    
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw new Error('Error al procesar el archivo Excel: ' + error.message);
  }
};

export const validateExcelData = (data, expectedColumns) => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error('El archivo está vacío o tiene un formato inválido');
  }

  Object.entries(data).forEach(([sheetName, rows]) => {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error(`La hoja "${sheetName}" está vacía`);
    }

    const firstRow = rows[0];
    const missingColumns = expectedColumns.filter(col => !(col in firstRow));
    
    if (missingColumns.length > 0) {
      throw new Error(`Columnas faltantes en "${sheetName}": ${missingColumns.join(', ')}`);
    }

    rows.forEach((row, index) => {
      ['visits', 'followers', 'views'].forEach(field => {
        if (field in row && isNaN(Number(row[field]))) {
          throw new Error(`Error en ${sheetName}, fila ${index + 2}: "${field}" debe ser un número`);
        }
      });
    });
  });

  return true;
};