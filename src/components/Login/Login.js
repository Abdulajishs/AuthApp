import React, { useContext, useEffect, useReducer, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../Input/Input';

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") }
  } 
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") }
  }
  return { value: "", isValid: false }
}

const passwordReducer = (state,action)=>{
  if (action.type === "USER_PASSWORD") {
    return {value : action.val , isValid : action.val.trim().length > 6}
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6}
  }
  return {value:"",isValid : false}
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [enteredCName, setEnteredCName] = useState("");
  const [cNameIsValid, setcNameIsValid] = useState();

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null
  });

  const [passwordState , dispatchPassword]  = useReducer(passwordReducer,{
    value : "",
    isValid : null
  })

  const [formIsValid, setFormIsValid] = useState(false);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    console.log("effect runs");
    return () => {
      console.log("Cleanup effect");
    }
  }, [])

  // useEffect(()=>{
  //   const identifier = setTimeout(() => {
  //     console.log('check form validity');
  //     setFormIsValid(
  //       enteredEmail.includes('@') && enteredPassword.trim().length > 6 && enteredCName.trim().length > 0 
  //     );
  //   }, 500);

  //   return () =>{
  //     console.log("CleanUp");
  //     clearTimeout(identifier);
  //   }

  // },[enteredEmail,enteredPassword,enteredCName])

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatchEmail({ type: "USER_INPUT", val: event.target.value })
    setFormIsValid(
      event.target.value.includes('@') && passwordState.isValid  && enteredCName.trim().length > 0
    );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({type : "USER_PASSWORD" , val : event.target.value})
    setFormIsValid(
      emailState.isValid && event.target.value.trim().length > 6 && enteredCName.trim().length > 0
    );
  };

  const cNameChangeHandler = (event) => {
    setEnteredCName(event.target.value);
    setFormIsValid(
      emailState.isValid && passwordState.isValid  && event.target.value.trim().length > 0
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({type : "INPUT_BLUR"});
  };

  const validatecNameHandler = () => {
    setcNameIsValid(enteredCName.trim().length > 0);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value,enteredCName);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
        label = "E-Mail"
        id="email"
        type = "email"
        isValid={emailState}
        value={emailState.value}
        onChange={emailChangeHandler}
        onBlur = {validateEmailHandler}
        />
        <Input
        label = "Password"
        id="password"
        type = "password"
        isValid={passwordState}
        value={passwordState.value}
        onChange={passwordChangeHandler}
        onBlur = {validatePasswordHandler}
        />
        <Input
        label = "College Name"
        id="cname"
        type = "text"
        isValid={cNameIsValid}
        value={enteredCName}
        onChange={cNameChangeHandler}
        onBlur = {validatecNameHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
