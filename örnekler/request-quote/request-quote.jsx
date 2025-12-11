import React from 'react';

const RequestQuoteMain = () => {
	return (
		<>
			<div className="request__quote section-padding-three">
				<div className="container">
					<div className="row">
						<div className="col-xl-12">
							<form action="#">
								<div className="row">
									<div className="col-md-6 mt-30">
										<div className="request__quote-item">
											<label>First Name<span> *</span></label>
											<input type="text" name="name" placeholder="First" />
										</div>
									</div>
									<div className="col-md-6 mt-30">
										<div className="request__quote-item">
											<label>Last Name</label>
											<input type="text" placeholder="Last" />
										</div>
									</div>
									<div className="col-md-6 mt-30">
										<div className="request__quote-item">
											<label>Email Address<span> *</span></label>
											<input type="email" placeholder="Email" />
										</div>
									</div>
									<div className="col-md-6 mt-30">
										<div className="request__quote-item">
											<label>Number<span> *</span></label>
											<input type="text" placeholder="+00 123 4567" />
										</div>
									</div>
									<div className="col-md-6 mt-30">
										<div className="request__quote-item">
											<label>Company/Organization<span> *</span></label>
											<input type="text" placeholder="Envato" />
										</div>
									</div>
									<div className="col-md-6 mt-30">
										<div className="request__quote-item">
											<label>Website<span> *</span></label>
											<input type="text" placeholder="http://envato.com" />
										</div>
									</div>
									<div className="col-md-12 mt-30">
										<p className="mb-10">What services can we provide you?<span> *</span></p>
										<div className="row">
											<div className="col-md-4">
												<div className="request__quote-services">
													<label><input className="mr-10" type="checkbox" />Optimization (SEO)</label>
													<label><input className="mr-10" type="checkbox" />Web Design</label>
													<label><input className="mr-10" type="checkbox" />Web Hosting / Maintenance</label>
												</div>
											</div>
											<div className="col-md-4">
												<div className="request__quote-services">
													<label><input className="mr-10" type="checkbox" />Content Writing</label>
													<label><input className="mr-10" type="checkbox" />Search Engine Marketing</label>
													<label><input className="mr-10" type="checkbox" />Social Media</label>
												</div>
											</div>
											<div className="col-md-4">
												<div className="request__quote-services">
													<label><input className="mr-10" type="checkbox" />ADA Compliance</label>
													<label><input className="mr-10" type="checkbox" />Photography / Video</label>
													<label><input className="mr-10" type="checkbox" />Email Marketing</label>
												</div>
											</div>
										</div>
									</div>
									<div className="col-md-12 mt-30">
										<div className="request__quote-item">
											<label>Message<span> *</span></label>
											<textarea name="message"></textarea>
										</div>
									</div>
									<div className="col-lg-12">
										<button className="build_button mt-30" type="submit">Submit Now<i className="flaticon-right-up"></i></button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default RequestQuoteMain;