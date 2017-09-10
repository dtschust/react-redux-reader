import React from 'react';

export default function({
	title,
	count,
	isActive,
}) {
	return (
		<div style={{ backgroundColor: isActive ? 'blue': undefined }}>
			<h3>{title} ({count})</h3>
		</div>
	)
}