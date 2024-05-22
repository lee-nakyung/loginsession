import React from 'react';
import { MainLine } from '../main/main';
import { MainP } from '../main/main';
import { PContainer } from '../main/main';
import styled from 'styled-components';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API/api';

const AllContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const Textfield = styled.input`
  width: 244px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #7a7485;
  padding: 0 14px;
  color: #1d1927;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  &:focus {
    outline: none;
    border-color: ${(props) => (props.emailError ? '#FF001A' : '#7A7485')};
  }
`;

const Duplibutton = styled.button`
  width: 96px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #0028da;
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const FieldbuttonCon = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const FieldContainer = styled.div`
  height: 66px;
`;

const PWfield = styled.input`
  color: #1d1927;
  width: 352px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #7a7485;

  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  padding: 0 14px;

  ::placeholder {
    color: #b4b4b4;
  }
`;

const Register = styled.button`
  width: 352px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #0028da;
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ErrorMessage = styled.p`
  color: #ff001a;
  font-family: Inter;
  font-size: 8px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  position: absolute;
  left: 30px;
  top: 54px;
`;

const FieldWithMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-content: flex-start;
  position: relative; // 필드를 포지셔닝 컨텍스트로 설정
  width: 352px; // 필드의 너비 지정
  margin-bottom: 20px; // 각 필드 간의 간격 조정
`;

const Message = styled.p`
  color: #ff001a;
  font-family: Inter;
  font-size: 10px;
  position: absolute;
  bottom: -15px; // 메시지를 필드 아래에 위치
  left: 0;
  right: 0;
  margin-left: 9px;
  text-align: left;
  visibility: visible;
  transition: visibility 0.2s, opacity 0.2s ease-in-out;
  opacity: 1; // 메시지가 보이도록 설정
`;

function Signup() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);
  const [emailMessage, setEmailMessage] = useState('');

  const [userId, setUserId] = useState('');
  const [userIdStatus, setUserIdStatus] = useState(null);
  const [userIdMessage, setUserIdMessage] = useState('');

  const [tell, setTell] = useState('');
  const [tellStatus, setTellStatus] = useState(null); // Corrected typo here
  const [tellMessage, setTellMessage] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API.baseURL}/api/member/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          password: password,
          phone: tell,
          email: email,
        }),
      });

      console.log(`Status: ${response.status}`);

      if (!response.ok) {
        throw new Error('회원가입에 실패했습니다.');
      }

      navigate('/');
      alert('회원가입이 완료되었습니다.');
    } catch (error) {
      alert('회원가입에 실패하였습니다.');
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailStatus(null);
  };

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
    setUserIdStatus(null);
  };

  const handleTellChange = (event) => {
    setTell(event.target.value);
    setTellStatus(null);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (!passwordTouched) setPasswordTouched(true);
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
    if (!passwordConfirmTouched) setPasswordConfirmTouched(true);
  };

  const isValidPassword = password.length >= 4;

  const passwordsMatch = password === passwordConfirm && isValidPassword;

  useEffect(() => {
    const checkField = async (fieldType, fieldValue, setStatus, setMessage) => {
      if (!fieldValue) {
        setStatus(null);
        setMessage('');
        return;
      }

      const status = await checkAvailability(fieldType, fieldValue);
      setStatus(status);

      const messageMap = {
        email: {
          200: '사용 가능한 이메일입니다.',
          400: '이메일 형식을 맞춰주세요.',
          409: '이미 사용 중인 이메일입니다.',
        },
        userId: {
          200: '사용 가능한 아이디입니다.',
          409: '이미 사용중인 아이디입니다.',
        },
        tell: {
          200: '사용 가능한 전화번호입니다.',
          400: '전화번호 형식을 맞춰주세요.',
          409: '이미 사용중인 전화번호입니다.',
        },
      };

      setMessage(messageMap[fieldType][status] || '');
    };

    const timerEmail = setTimeout(() => {
      checkField('email', email, setEmailStatus, setEmailMessage);
    }, 0);

    const timerUserId = setTimeout(() => {
      checkField('userId', userId, setUserIdStatus, setUserIdMessage);
    }, 0);

    const timerTell = setTimeout(() => {
      checkField('tell', tell, setTellStatus, setTellMessage);
    }, 0);

    return () => {
      clearTimeout(timerEmail);
      clearTimeout(timerUserId);
      clearTimeout(timerTell);
    };
  }, [email, userId, tell]);

  async function checkAvailability(type, value) {
    const endpoints = {
      email: `${API.baseURL}/api/member/exists/email?email=${encodeURIComponent(
        value
      )}`,
      userId: `${
        API.baseURL
      }/api/member/exists/userId?userId=${encodeURIComponent(value)}`,
      tell: `${API.baseURL}/api/member/exists/phone?phone=${encodeURIComponent(
        value
      )}`,
    };

    const url = endpoints[type];
    if (!url) {
      console.error('Invalid type for checkAvailability function');
      return null;
    }

    try {
      const response = await fetch(url, { method: 'GET' });
      console.log(`Status for ${type}:`, response.status); // Log every status
      if (!response.ok) {
        return response.status;
      }
      return response.status;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
    }
  }

  const emailBorderColor =
    emailStatus === 200
      ? '#0028da'
      : emailStatus === 400 || emailStatus === 409
      ? '#FF001A'
      : '#7a7485';
  const userIdBorderColor =
    userIdStatus === 200
      ? '#0028da'
      : userIdStatus === 409
      ? '#FF001A'
      : '#7a7485';
  const tellBorderColor =
    tellStatus === 200
      ? '#0028da'
      : tellStatus === 400 || tellStatus === 409
      ? '#FF001A'
      : '#7a7485';

  return (
    <>
      <AllContainer>
        <PContainer>
          <MainP>회원가입</MainP>
        </PContainer>
        <MainLine />
        <FieldWithMessage>
          <PWfield
            placeholder="이메일 ex) abc123@naver.com"
            value={email}
            onChange={handleEmailChange}
            style={{ borderColor: emailBorderColor }}
          />
          <Message
            style={{ color: emailStatus === 200 ? '#0028da' : '#FF001A' }}
          >
            {emailMessage}
          </Message>
        </FieldWithMessage>

        <FieldWithMessage>
          <PWfield
            placeholder="아이디"
            value={userId}
            onChange={handleUserIdChange}
            style={{ borderColor: userIdBorderColor }}
          />
          <Message
            style={{ color: userIdStatus === 200 ? '#0028da' : '#FF001A' }}
          >
            {userIdMessage}
          </Message>
        </FieldWithMessage>

        <FieldWithMessage>
          <PWfield
            placeholder="전화번호"
            value={tell}
            onChange={handleTellChange}
            style={{ borderColor: tellBorderColor }}
          />
          <Message
            style={{ color: tellStatus === 200 ? '#0028da' : '#FF001A' }}
          >
            {tellMessage}
          </Message>
        </FieldWithMessage>

        <FieldWithMessage>
          <PWfield
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            // 조건부 스타일 적용: 비밀번호 유효성 검사 결과에 따라 색상 변경
            style={{
              borderColor: passwordTouched
                ? isValidPassword
                  ? '#0028da'
                  : '#FF001A'
                : '#7a7485',
            }}
          />
          <Message
            style={{
              color: isValidPassword ? '#0028da' : '#FF001A',
            }}
          >
            {isValidPassword
              ? '사용 가능한 비밀번호입니다.'
              : passwordTouched
              ? '비밀번호는 4글자 이상이어야 합니다.'
              : ''}
          </Message>
        </FieldWithMessage>

        <FieldWithMessage>
          <PWfield
            placeholder="비밀번호 확인"
            type="password"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            style={{
              borderColor: passwordConfirmTouched
                ? passwordsMatch
                  ? '#0028da'
                  : '#FF001A'
                : '#7a7485',
            }}
          />
          <Message
            style={{
              color: passwordsMatch ? '#0028da' : '#FF001A',
            }}
          >
            {passwordsMatch
              ? '비밀번호가 일치합니다.'
              : passwordConfirmTouched
              ? '비밀번호가 일치하지 않습니다.'
              : ''}
          </Message>
        </FieldWithMessage>

        <Register onClick={handleRegister}>회원가입</Register>
      </AllContainer>
    </>
  );
}

export default Signup;
