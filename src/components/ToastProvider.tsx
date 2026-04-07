import { useEffect } from 'react';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';

// 💡 화면에 표시할 최대 토스트 개수 설정
const TOAST_LIMIT = 1;

export default function ToastProvider() {
    const { toasts } = useToasterStore();

    // 토스트 개수 제한 로직
    useEffect(() => {
        toasts
            .filter((t) => t.visible) // 현재 화면에 보이는 토스트만 필터링
            .filter((_, i) => i >= TOAST_LIMIT) // 설정한 개수를 초과하는 예전 토스트들만 선택
            .forEach((t) => toast.dismiss(t.id)); // 해당 토스트들을 화면에서 강제로 지움
    }, [toasts]);

    return (
        <Toaster
            position="bottom-center"
            containerStyle={{
                bottom: 20 
            }}
            toastOptions={{
                style: {
                    background: "#fff",
                    color: "#6b21a8",
                    borderRadius: "12px",
                    padding: "12px 16px",
                },
            }}
        />
    );
}