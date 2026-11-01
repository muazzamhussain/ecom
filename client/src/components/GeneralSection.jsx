import SectionHeader from "./ui/SectionHeader";
import SelectField from "./ui/SelectField";

const GeneralSection = ({ draft, update }) => {
  const LANGUAGES = ["English", "Español", "Français", "Deutsch", "اردو"];

  const CURRENCIES = ["USD", "EUR", "GBP", "PKR"];

  const TIMEZONES = [
    "America/New_York",

    "Europe/London",

    "Europe/Berlin",

    "Asia/Karachi",

    "Asia/Dubai",
  ];
  return (
    <div>
      <SectionHeader
        title="General"
        description="Choose your language, currency and regional settings."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField
          label="Language"
          value={draft.language}
          options={LANGUAGES}
          onChange={(v) => update(null, "language", v)}
        />

        <SelectField
          label="Currency"
          value={draft.currency}
          options={CURRENCIES}
          onChange={(v) => update(null, "currency", v)}
        />

        <div className="sm:col-span-2">
          <SelectField
            label="Timezone"
            value={draft.timezone}
            options={TIMEZONES}
            onChange={(v) => update(null, "timezone", v)}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralSection;
