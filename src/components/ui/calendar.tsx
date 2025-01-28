import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayFlag, DayPicker, SelectionState, UI } from 'react-day-picker'

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-4', className)}
      classNames={{
        [UI.Months]: 'flex flex-row justify-between', // Cambiado a "flex-row" con espacio entre meses
        [UI.Month]: 'space-y-4 flex-grow-0 first:mr-4 !important last:ml-4 !important',
        [UI.MonthCaption]: 'flex justify-center items-center h-7',
        [UI.CaptionLabel]: 'text-sm capitalize font-medium',
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute left-4 top-3 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute right-4 top-3 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        [UI.MonthGrid]: 'w-full border-collapse space-y-1',
        [UI.Weekdays]: 'flex',
        [UI.Weekday]:
          'text-muted-foreground capitalize rounded-md w-9 font-normal text-[0.8rem]',
        [UI.Week]: 'flex w-full mt-2',
        [UI.Day]:
  'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        [UI.DayButton]: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 bg-transparent font-normal aria-selected:opacity-100 hover:bg-primary hover:text-primary-foreground',
        ),
        [SelectionState.selected]:
        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
      [SelectionState.range_middle]:
        'bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground',
      [SelectionState.range_start]:
        'bg-primary text-primary-foreground rounded-l-md',
      [SelectionState.range_end]:
        'bg-primary text-primary-foreground rounded-r-md',
  [DayFlag.today]: 'bg-accent text-accent-foreground',
  [DayFlag.outside]: 'text-muted-foreground opacity-50',
  [DayFlag.disabled]: 'text-muted-foreground opacity-50',
  [DayFlag.hidden]: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('h-4 w-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('h-4 w-4', className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
