import React from 'react';

export default function({ id, title, count, isActive, selectSub, style }) {
	return (
		<div
			id={`sub-item-${id}`}
			style={{
				backgroundColor: isActive ? '#2d2e31' : undefined,
				padding: '0 15px',
				cursor: 'pointer',
				...style,
			}}
			onClick={() => {
				selectSub(id);
			}}
		>
			<div
				style={{
					lineHeight: '2',
					display: 'flex',
				}}
			>
				<div
					style={{
						flex: '1',
						justifyContent: 'flex-start',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{title}
				</div>
				<div
					style={{
						flex: '1',
						justifyContent: 'flex-end',
						maxWidth: '15px',
						paddingLeft: '5px',
					}}
				>
					{count > 0 ? count : undefined}
				</div>
			</div>
		</div>
	);
}
