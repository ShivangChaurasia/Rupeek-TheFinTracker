export default function LogoText({ className = "" }) {
    return (
        <span className={`font-bold text-blue-600 ${className}`}>
            Rup
            <span className="inline-block text-[#ffb700] animate-swap-right">e</span>
            <span className="inline-block text-[#ffb700] animate-swap-left">e</span>
            k
        </span>
    );
}
