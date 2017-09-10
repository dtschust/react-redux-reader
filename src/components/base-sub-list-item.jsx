import React from 'react';

export default function({
	title,
	count,
	isActive,
}) {
	return (
		<div>
			<h3>{title} ({count})</h3>
		</div>
	)
}