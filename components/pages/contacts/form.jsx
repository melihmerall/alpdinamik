import React from 'react';

const FormArea = () => {
    return (
        <>
            <form action="#">
                <div className="row">
                    <div className="col-md-6 mb-25">
                        <div className="contact__form-area-item">
                            <input type="text" name="name" placeholder="Full Name" required="required" />
                        </div>
                    </div>
                    <div className="col-md-6 md-mb-25">
                        <div className="contact__form-area-item">
                            <input type="email" name="email" placeholder="Email Address" required="required" />
                        </div>
                    </div>
                    <div className="col-md-12 mb-25">
                        <div className="contact__form-area-item">
                            <input type="text" name="subject" placeholder="Subject" />
                        </div>
                    </div>
                    <div className="col-md-12 mb-25">
                        <div className="contact__form-area-item">
                            <textarea name="message" placeholder="Message"></textarea>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="contact__form-area-item">
                            <button className="build_button" type="submit">Submit Message <i className="flaticon-right-up"></i></button>
                        </div>
                    </div>
                </div>
            </form>          
        </>
    );
};

export default FormArea;