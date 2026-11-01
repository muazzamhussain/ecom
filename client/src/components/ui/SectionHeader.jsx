const SectionHeader = ({ title, description }) => (
  <div className="mb-6">
    <h3 className="font-heading font-bold text-lg sm:text-xl uppercase tracking-tight text-black">
      {title}
    </h3>

    <p className="font-body text-sm text-black/60 mt-1">{description}</p>
  </div>
);

export default SectionHeader;
