interface MyObjectsInterface {
    [key: string]: string;
}

type ModalProps = {
    title: string;
    message: string; // ข้อความ
    type: "INFORMATION" | "WARNING";
    onClose: () => void; // ฟังก์ชันปิด Modal นี้
    id: MyObjectsInterface; // ค่า Parameter ที่จะส่งไปยัง Backend
    func: (id: MyObjectsInterface) => void; // ฟังก์ชันเรียกใช้งาน API ใน Modal นี้โดยส่งค่า id ไปด้วย
};

const Modal = ({ title, message, type, id, func, onClose }: ModalProps) => {
    if (type !== "WARNING") {
        return (
            <>
                <div className="fixed inset-0 z-50 bg-gray-500"></div>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <div className="mx-auto w-full overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-sm">
                        <div className="relative p-5">
                            <div className="text-center">
                                <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-secondary-900">{title}</h3>
                                    <div className="mt-2 text-sm text-secondary-500">{message}</div>
                                </div>
                            </div>
                            <div className="mt-5 flex justify-center gap-3">
                                <button
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
                                    onClick={() => { onClose(); }}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    className="flex-1 rounded-lg border border-blue-500 bg-blue-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-blue-300"
                                    onClick={() => {
                                        func(id);

                                        window.location.reload();
                                    }}
                                >
                                    ตกลง
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-8 rounded w-96 text-center">
                <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p>{message}</p>
                <div className="mt-5 flex justify-center gap-3">
                    <button
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
                        onClick={() => { onClose(); }}
                    >
                        ยกเลิก
                    </button>
                    <button
                        className="flex-1 rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300"
                        onClick={() => {
                            func(id);

                            window.location.reload();
                        }}
                    >
                        ลบ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
