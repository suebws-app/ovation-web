import { SignInBackGuard } from "./SignInBackGuard";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <SignInBackGuard>{children}</SignInBackGuard>;
};

export default Layout;
