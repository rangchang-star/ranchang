'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';

// 音频URL - 奇异恩典纯乐器
const AMAZING_GRACE_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = new Audio(AMAZING_GRACE_AUDIO);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      alert('请输入正确的手机号');
      return;
    }
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = () => {
    if (!phone || !code) {
      alert('请填写完整信息');
      return;
    }
    // 这里应该调用登录API
    router.push('/discovery');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-md mx-auto px-5 pt-[60px]">
        {/* Logo + 音乐符号 */}
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleMusic}
            className="relative w-[150px] h-[150px] flex items-center justify-center"
          >
            <img
              src="/logo-ranchang.png"
              alt="燃场Logo"
              className="w-[110px] h-[110px] object-contain"
            />
            <Music2
              className={`absolute w-7 h-7 transition-colors ${
                isPlaying
                  ? 'text-[rgba(0,0,0,0.7)]'
                  : 'text-[rgba(0,0,0,0.3)]'
              }`}
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          </button>
        </div>

        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-gray-900 mb-2">欢迎来到燃场</h1>
          <p className="text-[13px] text-[rgba(0,0,0,0.4)]">只要抓住使命，当年力量如何，现在力量也必定如何</p>
        </div>

        {/* 登录表单 */}
        <div className="space-y-4">
          {/* 手机号输入 */}
          <div className="space-y-2">
            <label className="text-[13px] text-[rgba(0,0,0,0.6)]">手机号</label>
            <input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
              className="w-full px-4 py-3 bg-[rgba(0,0,0,0.05)] text-[13px] text-gray-900 placeholder-[rgba(0,0,0,0.25)] focus:outline-none focus:bg-[rgba(0,0,0,0.08)] transition-colors"
            />
          </div>

          {/* 验证码输入 */}
          <div className="space-y-2">
            <label className="text-[13px] text-[rgba(0,0,0,0.6)]">验证码</label>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="flex-1 px-4 py-3 bg-[rgba(0,0,0,0.05)] text-[13px] text-gray-900 placeholder-[rgba(0,0,0,0.25)] focus:outline-none focus:bg-[rgba(0,0,0,0.08)] transition-colors"
              />
              <button
                onClick={handleSendCode}
                disabled={countdown > 0}
                className={`px-6 py-3 text-[13px] font-normal whitespace-nowrap transition-colors ${
                  countdown > 0
                    ? 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.4)]'
                    : 'bg-blue-400 text-white hover:bg-blue-500'
                }`}
              >
                {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
              </button>
            </div>
          </div>

          {/* 登录按钮 */}
          <Button
            onClick={handleLogin}
            className="w-full bg-blue-400 hover:bg-blue-500 font-normal text-[13px] py-3 mt-6"
          >
            登录
          </Button>
        </div>

        {/* 跳转注册 */}
        <div className="text-center mt-8">
          <p className="text-[13px] text-[rgba(0,0,0,0.4)]">
            还没有账号？
            <Link href="/register" className="text-blue-400 hover:text-blue-500 ml-1 inline-flex items-center">
              立即注册
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
