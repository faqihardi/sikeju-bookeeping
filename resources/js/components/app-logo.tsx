import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center justify-center">
                <AppLogoIcon className="h-10 w-auto" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-lg">
                    SIKEJU
                </span>
            </div>
        </>
    );
}
