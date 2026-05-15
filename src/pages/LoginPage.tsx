import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Provider, User } from '@supabase/supabase-js';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import ChunkyButton from '../components/ChunkyButton';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 로그인된 유저 정보를 담을 상태
  const [user, setUser] = useState<User | null>(null);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    // 1. 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. 로그인 상태 변화 감지 (로그인/로그아웃 시 자동 반영)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert('회원가입 실패: ' + error.message);
    else alert('회원가입 성공!');
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('로그인 실패: ' + error.message);
    setLoading(false);
  }

  async function handleSocialLogin(provider: Provider) {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'http://localhost:5173/login',
      },
    });
  }

  // 로그아웃 함수
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) alert('로그아웃 실패: ' + error.message);
    else alert('로그아웃 되었습니다!');
  }

  // 로그인 상태일 때 보여줄 화면
  if (user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <div style={{ border: '1px solid #ccc', padding: '30px', borderRadius: '15px', textAlign: 'center', width: '350px' }}>
          <h2>안녕하세요!</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}><strong>{user.email}</strong> 님 접속 중</p>
          <button onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  // 로그아웃 상태일 때 보여줄 화면 (기존 폼)
  return (
    <div className="min-h-screen bg-white sm:bg-gray-50 text-gray-900 flex sm:items-center justify-center">

      {/* 모바일에서는 전체, 데스크탑에서는 카드 */}
      <div className="max-w-md w-full bg-white sm:rounded-2xl sm:shadow-xl overflow-hidden flex flex-col">
        {/* 헤더 */}
        <header className="p-4 pb-0 sm:p-6 sm:pb-0">
          {/* 뒤로가기 버튼 */}
          <button
            type="button"
            className="text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </header>

        {/* 본문 */}
        <main className="px-6 pb-6 flex-1 flex flex-col">

          {/* 로고 */}
          <div className="flex justify-center mb-3">
            <img
              src="/logo-bg-white.png"
              alt="EduPlay Logo"
              className="w-80 object-cover"
            />
          </div>

          {/* 아이디, 비번 입력 인풋 */}
          <form className="space-y-5" onSubmit={handleLogin}>

            {/* ID Input */}
            <div>
              <label htmlFor="userId" className="sr-only">아이디</label>
              <input
                id="userId"
                type="text"
                placeholder="아이디를 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="userPassword" className="sr-only">비밀번호</label>
              <input
                id="userPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Login Button */}
            <ChunkyButton size='md' className='w-full'>로그인</ChunkyButton>
          </form>

          {/* 회원가입, 비밀번호 찾기 인풋 */}
          <div className="flex items-center justify-center gap-5 mt-6 text-sm text-gray-500 font-medium">
            <button type="button" className="hover:text-gray-900 transition-colors">회원가입</button>
            <div className="w-px h-3.5 bg-gray-300"></div>
            <button type="button" className="hover:text-gray-900 transition-colors">비밀번호 찾기</button>
          </div>

          {/* sns 로그인 영역 */}
          <div className="pt-10 pb-6 sm:pb-0">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-x-0 h-px bg-gray-200"></div>
              <span className="relative bg-white px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                SNS 간편 로그인
              </span>
            </div>

            <div className="flex justify-center gap-6">
              <SocialLoginButton provider="kakao">
                <RiKakaoTalkFill className="w-7 h-7 text-[#371D1E]" />
              </SocialLoginButton>

              <SocialLoginButton provider="google">
                <FcGoogle className="w-7 h-7" />
              </SocialLoginButton>

              <SocialLoginButton provider="github">
                <FaGithub className="w-7 h-7 text-white" />
              </SocialLoginButton>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}


interface SocialLoginButtonProps {
  provider: 'kakao' | 'google' | 'github';
  onClick?: () => void;
  children: React.ReactNode;
}

const SocialLoginButton = ({ provider, onClick, children }: SocialLoginButtonProps) => {
  const providerStyles = {
    kakao: "bg-[#FEE500] focus:ring-[#FEE500]",
    google: "bg-white border border-gray-200 focus:ring-gray-200",
    github: "bg-[#24292F] focus:ring-[#24292F]",
  };

  const ariaLabels = {
    kakao: "카카오로 로그인",
    google: "구글로 로그인",
    github: "깃허브로 로그인",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${providerStyles[provider]}`}
      aria-label={ariaLabels[provider]}
    >
      {children}
    </button>
  );
};