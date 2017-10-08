import React, {Component} from 'react';
import Header from "./Header";
import Shortener from "./Shortener";
import History from "./History";
import {request, registerUser} from "../utils"

class App extends Component {
	constructor() {
		super();
		this.state = {
			originalUrl: '',
			shortUrl: '',
			urlValid: true,
			urls: {
				data: [],
				currentPage: 0,
				total: 1
			}
		};
		
		this._shorten = this._shorten.bind(this);
		this._paging = this._paging.bind(this);
		this._urlChangeHandler = this._urlChangeHandler.bind(this);
	}
	
	async componentWillMount() {
		await registerUser();
		await this._paging(1);
	}
	
	async _shorten() {
		try {
			const response = await request('/urls', {
				url: this.state.originalUrl
			}, 'POST');
			if (response.ok) {
				const {url, shortId, createdAt} = await response.json();
				this.setState(prevState => {
					const newState = {
						shortUrl: `${document.location.href}${shortId}`
					};
					if (response.status === 201)
						newState['urls'] = {
							data: [
								{url, shortId, createdAt, clicks: 0},
								...prevState.urls.data.slice(0, 2)
							],
							currentPage: 1,
							total: Math.ceil((prevState.urls.data.length + 1) / 3)
						};
					return newState;
				});
			}
		}
		catch (error) {
			console.error(error);
		}
	}
	
	async _paging(next = 1) {
		try {
			const response = await request('/urls', {
				page: this.state.urls.currentPage + next,
				limit: 3
			});
			if (response.ok) {
				const {data, paging} = await response.json();
				return this.setState(() => {
					return {
						urls: {
							data,
							currentPage: paging.current,
							total: Math.ceil(paging.total / 3)
						}
					}
				});
			}
		}
		catch (error) {
			console.error(error);
		}
	}
	
	_urlChangeHandler(event) {
		//persist event value to be used in set state
		event.persist();
		const urlValid = event.target.checkValidity();
		this.setState(() => ({
			originalUrl: event.target.value,
			urlValid: urlValid
		}));
	}
	
	render() {
		return (
			<div>
				<Header/>
				<div className="container">
					<div className="row">
						<div className="col-lg-2"/>
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
							<Shortener
								shorten={this._shorten}
								valid={this.state.urlValid}
								urlChangeHandler={this._urlChangeHandler}
								originalUrl={this.state.originalUrl}
								shortUrl={this.state.shortUrl}
							/>
							<History
								urls={this.state.urls}
								paging={this._paging}
							/>
						</div>
						<div className="col-lg-2"/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
