import PageContainer from "./PageContainer";
import AppCard from "../cards/AppCard";

function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <PageContainer>
      <AppCard
        title={title}
        subtitle={subtitle}
      >
        {children}
      </AppCard>
    </PageContainer>
  );
}

export default AuthLayout;