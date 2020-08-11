import { Heading } from "@chakra-ui/core";

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <>
      <Heading pl="5px" mb="0.5em" fontWeight="bold">
        {title}
      </Heading>
    </>
  );
};

export default PageHeader;
