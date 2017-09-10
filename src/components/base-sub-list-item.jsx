import React from 'react';

export default function({
	id,
	title,
	count,
	isActive,
	selectSub,
	style,
}) {
	return (
		<div
			style={{
				backgroundColor: isActive ? '#2d2e31': undefined,
				padding: '0 15px',
				...style,
			}}
			onClick={() => { selectSub(id) }}
		>
			<div style={{
				lineHeight: '2',
			}}>
				{title}
				<span style={{float: 'right' }}>{count}</span>
			</div>
		</div>
	)
}