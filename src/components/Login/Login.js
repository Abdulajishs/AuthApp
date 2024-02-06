import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';

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
  if (action.type === "USER_INPUT") {
    return {value : action.val , isValid : action.val.trim().length > 6}
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6}
  }
  return {value:"",isValid : false}
}

const cnameReducer = (state,action)=>{
  if (action.type === "USER_INPUT") {
    return {value : action.val , isValid : action.val.trim().length > 0}
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 0}
  }
  return {value:"",isValid : false}
}

const Login = (props) => {

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null
  });

  const [passwordState , dispatchPassword]  = useReducer(passwordReducer,{
    value : "",
    isValid : null
  })

  const [cnameState , dispatchCname] = useReducer(cnameReducer,{
    value : "",
    isValid : null
  })

  const [formIsValid, setFormIsValid] = useState(false);

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef()
  const passwordInputRef = useRef()
  const cnameInputRef = useRef()

  useEffect(() => {
    console.log("effect runs");
    return () => {
      console.log("Cleanup effect");
    }
  }, [])

  const {isValid : emailIsValid} = emailState;
  const {isValid : passwordIsValid} = passwordState;
  const {isValid : cnameIsValid} = cnameState;


  useEffect(()=>{
    const identifier = setTimeout(() => {
      console.log('check form validity');
      setFormIsValid(
        emailIsValid && passwordIsValid && cnameIsValid
      );
    }, 500);

    return () =>{
      console.log("CleanUp");
      clearTimeout(identifier);
    }
  },[emailIsValid,passwordIsValid,cnameIsValid ])

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value })
    setFormIsValid(
      event.target.value.includes('@') && passwordState.isValid  && cnameState.isValid
    );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type : "USER_INPUT" , val : event.target.value})
    setFormIsValid(
      emailState.isValid && event.target.value.trim().length > 6 && cnameState.isValid
    );
  };

  const cNameChangeHandler = (event) => {
    dispatchCname({type: "USER_INPUT",val : event.target.value})
    setFormIsValid(
      emailState.isValid && passwordState.isValid  && event.target.value.trim().length > 0
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type : "INPUT_BLUR"});
  };

  const validatecNameHandler = () => {
    dispatchCname({type:"INPUT_BLUR"})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value,cnameState.value);
    }else if(!emailIsValid){
       emailInputRef.current.focus();
    }else if(!passwordIsValid){
      passwordInputRef.current.focus();
    }else{
      cnameInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
        ref = {emailInputRef}
        label = "E-Mail"
        id="email"
        type = "email"
        isValid={emailIsValid}
        value={emailState.value}
        onChange={emailChangeHandler}
        onBlur = {validateEmailHandler}
        />
        <Input
        ref = {passwordInputRef}
        label = "Password"
        id="password"
        type = "password"
        isValid={passwordIsValid}
        value={passwordState.value}
        onChange={passwordChangeHandler}
        onBlur = {validatePasswordHandler}
        />
        <Input
        ref = {cnameInputRef}
        label = "College Name"
        id="cname"
        type = "text"
        isValid={cnameIsValid}
        value={cnameState.value}
        onChange={cNameChangeHandler}
        onBlur = {validatecNameHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
