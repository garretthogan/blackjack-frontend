import { useState } from "react";

export default function ExpandableTray({ children, isExpanded, maxHeightExpanded }) {
    return (
        <div style={{ maxHeight: isExpanded ? maxHeightExpanded : '12px', overflow: isExpanded ? 'scroll' : 'hidden', paddingLeft: 24, paddingTop: '12px', borderBottom: isExpanded ? 'none' : '1px solid #FAECE2' }}>
            {children}
        </div>
    )
}