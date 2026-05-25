
export default function InfoSetting() {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mt-4 mb-6 w-full">

            <h3 className="text-purple-950 font-bold text-xl mb-5">
                에듀플레이를 이용해 주셔서 감사합니다.
            </h3>

            <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-2">
                <p>
                    현재 에듀플레이의 설정 페이지는 <span className="font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">임시 버전</span>으로 운영되고 있습니다.
                </p>
                <p>
                    등록하신 친구들의 사진과 정보는 서버가 아닌 <span className="font-semibold text-slate-900 underline decoration-purple-200 decoration-2 underline-offset-4">현재 사용 중인 기기(로컬 브라우저)에만 저장</span>됩니다.
                    따라서 브라우저 캐시가 삭제되면  <span className="font-semibold text-slate-900 underline decoration-purple-200 decoration-2 underline-offset-4">데이터가 지워질 수 있으며</span>, 다른 기기와의 실시간 연동이 지원되지 않습니다.
                </p>
                <p className="pt-1 text-slate-700 font-medium">
                    앞으로 선생님들이 더 편리하게 이용하실 수 있도록 빠른 시일 내에 안전한 <span className="text-purple-600 font-semibold">로그인 기능</span>과 <span className="text-purple-600 font-semibold">기기간 연동 기능</span>을 구현하겠습니다.
                </p>
                <p className="pt-1 text-xs md:text-sm text-slate-400">
                    더욱 안정적인 서비스를 제공하기 위해 노력하겠습니다. 감사합니다.
                </p>
            </div>
        </div>
    );
}