import React from 'react';

export default function({
	id,
	title,
	count,
	isActive,
	selectSub,
}) {
	return (
		<div
			style={{ backgroundColor: isActive ? 'blue': undefined }}
			onClick={() => { selectSub(id) }}
		>
			<h3>{title} ({count})</h3>
		</div>
	)
}