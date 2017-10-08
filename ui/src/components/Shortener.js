import React from 'react';

export default ({originalUrl, urlChangeHandler, shortUrl, shorten, valid}) => (
	<div className="card" style={{marginBottom: '2%', marginTop: '2%'}}>
		<div className="card-body">
			<form className={`row ${!valid && 'was-validated'}`}>
				<div className="input-group" style={{padding: '1%'}}>
					<input type="url"
								 style={{width: '79%'}}
								 className="form-control"
								 id="longUrlInput"
								 aria-describedby="longUrlInput"
								 placeholder="your url here please!"
								 value={originalUrl}
								 onChange={urlChangeHandler}
					/>
					<button
						style={{width: '20%', marginLeft: '1%'}}
						type="button"
						className="btn btn-primary"
						disabled={originalUrl.length === 0 || !valid}
						onClick={shorten}
					>
						Shorten
					</button>
				</div>
				<div className="invalid-feedback"
						 style={{padding: '1%', display: valid ? 'none' : 'block'}}
				>
					Please provide a valid URL.
				</div>
			</form>
			<div className="row">
				<div className="input-group" style={{padding: '1%'}}>
					<input type="url"
								 style={{width: '79%'}}
								 className="form-control"
								 id="shortUrl"
								 aria-describedby="shortUrl"
								 readOnly={true}
								 value={shortUrl}
					/>
					<button
						style={{width: '20%', marginLeft: '1%'}}
						type="button"
						className="btn btn-default"
						onClick={() => {
							const input = document.getElementById('shortUrl');
							try {
								input.select();
								document.execCommand('copy');
							}
							catch (error) {
								console.warn('Warning: copy to clipboard failed!')
							}
						}}
					>
						Copy!
					</button>
				</div>
			</div>
		</div>
	</div>
);