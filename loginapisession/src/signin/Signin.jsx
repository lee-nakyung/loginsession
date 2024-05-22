import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Main, { PContainer } from '../main/main';
import { MainP } from '../main/main';
import { MainLine } from '../main/main';
import Bugi from '../images/Bugi.png';
import { ImgContainer } from '../main/main';
import { useEffect } from 'react';
import API from '../API/api';

const AllContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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
  font-size: 15px;
  font-weight: 600;
  margin-top: 8px;
`;

function Signin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API.baseURL}/api/member/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          password: password,
        }),
      });

      console.log(`Status: ${response.status}`); // 콘솔에 상태 코드 출력

      if (response.status === 401) {
        setErrorMessage('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (response.status === 404) {
        setErrorMessage('존재하지 않는 회원입니다.');
        return;
      }

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      sessionStorage.setItem('userId', userId);
      navigate('/LoginMain');
    } catch (error) {
      alert('로그인에 실패하였습니다.');
    }
  };

  return (
    <AllContainer>
      <PContainer>
        <MainP>로그인</MainP>
      </PContainer>
      <MainLine />
      <ImgContainer>
        <img
          src={Bugi}
          alt="부기"
          style={{ width: '153px', height: '166px' }}
        />
      </ImgContainer>
      <PWfield
        placeholder="아이디"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <br />
      <PWfield
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <Register onClick={handleLogin}>로그인</Register>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </AllContainer>
  );
}

export default Signin;
