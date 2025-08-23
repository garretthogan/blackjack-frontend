export default function ExpandableTray({
  children,
  isExpanded,
  maxHeightExpanded = '256px',
}) {
  return (
    <div
      style={{
        maxHeight: isExpanded ? maxHeightExpanded : 0,
        overflowY: isExpanded ? 'auto' : 'hidden',
        overflowX: 'hidden',
        paddingLeft: isExpanded ? 24 : 0,
        paddingTop: isExpanded ? 12 : 0,
        borderBottom: isExpanded ? 'none' : '1px solid #FAECE2',
        transition: 'max-height 200ms ease, padding 200ms ease',
      }}
      aria-hidden={!isExpanded}
    >
      {children}
    </div>
  );
}