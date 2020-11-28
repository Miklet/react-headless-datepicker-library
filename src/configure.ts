const DEFAULT_LOCALIZATION_SETTINGS = {
  nextMonthLabel: 'Next month',
  prevMonthLabel: 'Prev month',
  openCalendarWhenNoDateSelectedLabel: 'Choose date',
  openCalendarWhenDateSelectedLabel: 'Change date, {{date}}',
};

let localizationConfiguration = DEFAULT_LOCALIZATION_SETTINGS;

export function configure(localizationOverrides: Partial<typeof DEFAULT_LOCALIZATION_SETTINGS>) {
  localizationConfiguration = {
    ...localizationConfiguration,
    ...localizationOverrides,
  };
}
