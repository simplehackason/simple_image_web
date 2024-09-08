'use client'

export default function Scroll() {
  return (
    <>
      <style jsx>{`
        @keyframes move {
          25% {
            opacity: 1;
          }
          33% {
            opacity: 1;
            transform: translateY(30px);
          }
          67% {
            opacity: 1;
            transform: translateY(40px);
          }
          100% {
            opacity: 0;
            transform: translateY(55px) scale3d(0.5, 0.5, 0.5);
          }
        }
        @keyframes pulse {
          to {
            opacity: 1;
          }
        }
        .chevron {
          position: absolute;
          width: 28px;
          height: 8px;
          opacity: 0;
          transform: scale3d(0.5, 0.5, 0.5);
          animation: move 3s ease-out infinite;
        }
        .chevron:first-child {
          animation: move 3s ease-out 1s infinite;
        }
        .chevron:nth-child(2) {
          animation: move 3s ease-out 2s infinite;
        }
        .chevron:before,
        .chevron:after {
          content: ' ';
          position: absolute;
          top: 0;
          height: 100%;
          width: 51%;
          background: #fff;
        }
        .chevron:before {
          left: 0;
          transform: skew(0deg, 30deg);
        }
        .chevron:after {
          right: 0;
          width: 50%;
          transform: skew(0deg, -30deg);
        }
        .text {
          animation: pulse 2s linear alternate infinite;
        }
      `}</style>
      <div className="flex h-full w-full items-center justify-center bg-gray-800">
        <div className="relative h-6 w-6">
          <div className="chevron"></div>
          <div className="chevron"></div>
          <div className="chevron"></div>
          <span className="text -ml-[30px] mt-[75px] block whitespace-nowrap font-sans text-xs uppercase text-white opacity-25">
            Scroll down
          </span>
        </div>
      </div>
    </>
  )
}
