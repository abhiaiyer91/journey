import { useUserConfig } from "@/lib/hooks";
import "../lib/globals.css";
import { MainNav, UserNav } from "@/components/layout";

const MyApp = ({ Component, pageProps }) => {
  const { loading, userConfig, tx, refetch } = useUserConfig();

  if (loading) {
    return null;
  }

  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="font-extrabold">Journey</div>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            {/* <Search /> */}
            <UserNav userConfig={userConfig} />
          </div>
        </div>
      </div>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <Component
          {...pageProps}
          userConfig={userConfig}
          tx={tx}
          refetch={refetch}
        />
      </main>
    </>
  );
};
export default MyApp;
