import { Heading } from "@chakra-ui/core";

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <>
      <Heading mb="0.5em" fontWeight="bold">
        {title}
      </Heading>
    </>
  );
};

export default PageHeader;
