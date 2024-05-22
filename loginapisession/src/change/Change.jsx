import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Main, { PContainer } from '../main/main';
import { MainP } from '../main/main';
import { MainLine } from '../main/main';
import { useNavigate } from 'react-router-dom';
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

const FieldWithMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-content: flex-start;
  position: relative;
  width: 352px;
  margin-bottom: 20px;
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

function Change() {
  const [userInfo, setUserInfo] = useState({
    email: '',
    phone: '',
    userId: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageColor, setPasswordMessageColor] = useState('#7a7485');
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
  const [confirmPasswordMessageColor, setConfirmPasswordMessageColor] =
    useState('#7a7485');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      const userId = sessionStorage.getItem('userId');
      try {
        const response = await fetch(
          `${
            API.baseURL
          }/api/member/default-information?userId=${encodeURIComponent(userId)}`
        );
        const data = await response.json();
        if (response.status === 200) {
          setUserInfo({
            email: data.data.email || '',
            phone: data.data.phone || '',
            userId: data.data.userId || '',
            password: '',
            confirmPassword: '',
          });
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleRegisterClick = async () => {
    try {
      const response = await fetch(`${API.baseURL}/api/member/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.userId,
          pw1: userInfo.password,
          pw2: userInfo.confirmPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('비밀번호 변경 요청 실패');
      }

      const result = await response.json();
      console.log(response.status);
      if (result.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/');
      } else {
        alert(result.message || '비밀번호 변경 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('비밀번호 변경 처리 중 문제가 발생했습니다.');
    }
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setUserInfo({ ...userInfo, password: newPass });
    checkPassword(newPass);
  };

  const handlePasswordConfirmChange = (e) => {
    const newConfirmPass = e.target.value;
    setUserInfo({ ...userInfo, confirmPassword: newConfirmPass });
    validatePasswordMatch(userInfo.password, newConfirmPass);
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setConfirmPasswordMessage('비밀번호가 일치합니다.');
        setConfirmPasswordMessageColor('blue');
      } else {
        setConfirmPasswordMessage('비밀번호가 일치하지 않습니다.');
        setConfirmPasswordMessageColor('red');
      }
    }
  };

  const checkPassword = async (password) => {
    if (password.length < 4) {
      setPasswordMessage('비밀번호는 무조건 4자 이상이어야 합니다.');
      setPasswordMessageColor('red');
      return;
    }
    try {
      const response = await fetch(`${API.baseURL}/api/member/check-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.userId,
          pw: password,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setPasswordMessage('사용 가능한 비밀번호입니다.');
        setPasswordMessageColor('blue');
      } else if (response.status === 400) {
        setPasswordMessage('이전 비밀번호와 같을 수 없습니다.');
        setPasswordMessageColor('red');
      } else {
        throw new Error('Unexpected error from server');
      }
    } catch (err) {
      console.error('Password check failed:', err);
      setPasswordMessage('비밀번호 확인 중 오류가 발생했습니다.');
      setPasswordMessageColor('red');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <AllContainer>
        <PContainer>
          <MainP>비밀번호 변경</MainP>
        </PContainer>
        <MainLine />
        <FieldWithMessage>
          <PWfield type="email" value={userInfo.email} readOnly />
        </FieldWithMessage>
        <FieldWithMessage>
          <PWfield value={userInfo.userId} readOnly />
        </FieldWithMessage>
        <FieldWithMessage>
          <PWfield type="tel" value={userInfo.phone} readOnly />
        </FieldWithMessage>
        <FieldWithMessage>
          <PWfield
            placeholder="비밀번호"
            type="password"
            value={userInfo.password}
            onChange={handlePasswordChange}
            style={{ borderColor: passwordMessageColor }}
          />
          <Message style={{ color: passwordMessageColor }}>
            {passwordMessage}
          </Message>
        </FieldWithMessage>
        <FieldWithMessage>
          <PWfield
            placeholder="비밀번호 확인"
            type="password"
            value={userInfo.confirmPassword}
            onChange={handlePasswordConfirmChange}
            style={{ borderColor: confirmPasswordMessageColor }}
          />
          <Message style={{ color: confirmPasswordMessageColor }}>
            {confirmPasswordMessage}
          </Message>
        </FieldWithMessage>
        <Register onClick={handleRegisterClick}>비밀번호 변경</Register>
      </AllContainer>
    </>
  );
}

export default Change;
