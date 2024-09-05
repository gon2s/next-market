import Link from 'next/link';

export default function Home() {
  return (
    <div
      className={'flex flex-col items-center justify-between min-h-screen p-6'}
    >
      <div className={'flex flex-col items-center my-auto gap-2 *:font-medium'}>
        <span className={'text-9xl'}>🎃</span>
        <h1 className={'text-4xl'}>GONS</h1>
        <h2 className={'text-2xl'}>GONS 마켓에 어서오세요!</h2>
      </div>
      <div className={'w-full flex flex-col items-center gap-3 border-white'}>
        <Link
          className={
            'w-full bg-orange-500 text-white text-lg font-medium py-2.5 rounded-md text-center hover:bg-orange-400 transition-colors '
          }
          href={'/'}
        >
          시작하기
        </Link>
        <div className={'flex gap-2'}>
          <span>이미 계정이 있나요?</span>
          <Link className={'hover:underline'} href={'/'}>
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
