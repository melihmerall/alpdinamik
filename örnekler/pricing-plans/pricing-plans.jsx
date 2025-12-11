import Link from 'next/link';
import React from 'react';

const PricingPlansMain = () => {
	return (
		<>
				<div className="price__area section-padding">
					<div className="container">
						<div className="row">
							<div className="col-xl-4 col-md-6 xl-mb-25 wow fadeInUp" data-wow-delay=".4s">
								<div className="price__area-item">
									<div className="price__area-item-price">
										<span>Start Package</span>
										<h3>Basic Plan</h3>
										<h2>$89<span>/Per monthly</span></h2>
									</div>
									<div className="price__area-item-list">
										<ul>
											<li><i className="flaticon-checked"></i>Core feature access</li>
											<li><i className="flaticon-checked"></i>5 GB storage</li>
											<li><i className="flaticon-checked"></i>Email support</li>
											<li><i className="flaticon-checked"></i>Basic analytics</li>
											<li><i className="flaticon-checked"></i>Community forum access</li>
										</ul>
									</div>
									<div className="price__area-item-btn">
										<Link className="build_button" href="/contact-us">Get Started<i className="flaticon-right-up"></i></Link>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-md-6 md-mb-25 wow fadeInUp" data-wow-delay=".7s">
								<div className="price__area-item active">
									<div className="price__area-item-price">
										<span>Growth Package</span>
										<h3>Standard Plan</h3>
										<h2>$129<span>/Per monthly</span></h2>
									</div>
									<div className="price__area-item-list">
										<ul>
											<li><i className="flaticon-checked"></i> Access to all core features</li>
											<li><i className="flaticon-checked"></i> 50 GB storage</li>
											<li><i className="flaticon-checked"></i> Priority email support</li>
											<li><i className="flaticon-checked"></i> Advanced analytics</li>
											<li><i className="flaticon-checked"></i> Customizable dashboard</li>
										</ul>
										
									</div>
									<div className="price__area-item-btn">
										<Link className="build_button" href="/contact-us">Get Started<i className="flaticon-right-up"></i></Link>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-md-6 wow fadeInUp" data-wow-delay="1s">
								<div className="price__area-item">
									<div className="price__area-item-price">
										<span>Pro Package</span>
										<h3>Premium Plan</h3>
										<h2>$159<span>/Per monthly</span></h2>
									</div>
									<div className="price__area-item-list">
										<ul>
											<li><i className="flaticon-checked"></i> Premium security features</li>
											<li><i className="flaticon-checked"></i> Unlimited storage</li>
											<li><i className="flaticon-checked"></i> 24/7 phone and email support</li>
											<li><i className="flaticon-checked"></i> Basic analytics</li>
											<li><i className="flaticon-checked"></i> Custom branding options</li>
										</ul>                            
									</div>
									<div className="price__area-item-btn">
										<Link className="build_button" href="/contact-us">Get Started<i className="flaticon-right-up"></i></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
		</>
	);
};

export default PricingPlansMain;