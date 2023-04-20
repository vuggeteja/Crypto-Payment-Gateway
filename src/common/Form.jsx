import { Component } from "react";
import Joi from "joi-browser";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validation = () => {
    const { data } = this.state;
    const options = { abortEarly: false };
    const { error } = Joi.validate(data, this.schema, options);
    if (!error) return null;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    // console.log(errors,'valerror')
    if(errors) 
    // console.log(errors)
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validation();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors }; 
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value;
    switch (input.name) {
      case 'fullName':
        if (input.value.length < 5) {
          errors.fullName = 'Full Name must be at least 5 characters long!';
        } else if (input.value.length > 15) {
        errors.fullName = 'Full Name must be at most 15 characters long!';
        } else {
          errors.fullName = '';
        }
      break;

      case 'user_email':
        errors.user_email = !/^[a-zA-Z0-9._%+-]{5,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.value) ? 
        'Email should contain minimum 5 charcters and contains @example.com' : '';
        break;
      case 'phone':
        errors.phone = !/^[6789]\d{9}$/.test(input.value) ? 
        'Phone Number should start with 6-9 and contain 10 numbers':'';
        break;
      case 'password':
        errors.password = !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(input.value) ? 
        'Password should contain minimum 8 charcters long with 1 Uppercase, 1 Lowercase, 1 special character & 1 number':'';
        break;
      case 'confirmpassword':
        const password = this.state.data.password;
        errors.confirmpassword = input.value !== password ? 
          'Confirm password should match with password' : '';
        break;
      default:
        if (!input.value.trim()) {
          errors[input.name] = 'Please enter a value for this field';
        }
      break;
    }
    this.setState({ data, errors });
  };
}

export default Form;