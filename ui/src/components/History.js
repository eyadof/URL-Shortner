import React from 'react';
import moment from 'moment';

const Link = ({shortId, url, clicks, createdAt}) => {
	const {hostname} = new URL(url);
	return (
		<li
			className="list-group-item d-flex flex-row justify-content-between align-items-center">
			<div className="p-2">{hostname}</div>
			<div className="p-2 d-none d-md-block">{shortId}</div>
			<div className="p-2 d-none d-md-block">{clicks} click(s)</div>
			<div className="p-2 d-none d-md-block">{moment(createdAt).from(moment())}</div>
			<a
				className="p-2 btn btn-default fa fa-external-link"
				role="button"
				target="_new"
				href={`${document.location.href}${shortId}`}
			/>
		</li>
	)
};

export default ({urls, paging}) => {
	if (urls.data.length === 0)
		return null;
	return (
		<div className="card" style={{padding: '4%'}}>
			<p>Previous Links</p>
			<div className="list-group">
				{urls.data.map((url, i) => {
					return <Link key={i} {...url} />
				})}
			</div>
			<div
				className="d-flex flex-row justify-content-between align-items-center"
				style={{marginTop: '2%', marginLeft: '25%', width: '50%'}}
			>
				<button
					className="btn btn-outline-primary"
					onClick={() => {
						paging(-1)
					}}
					disabled={urls.currentPage === 1}
				>&lsaquo;</button>
				<span>{urls.currentPage}/{urls.total}</span>
				<button
					className="btn btn-outline-primary"
					onClick={() => {
						paging(1)
					}}
					disabled={urls.currentPage === urls.total}
				>&rsaquo;</button>
			</div>
		</div>
	)
}