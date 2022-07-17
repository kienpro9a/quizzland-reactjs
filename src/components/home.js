import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { db } from "../firebase"
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      const dataquiz = snapshot.val()
      setData(dataquiz.quizzs)
    })
  }, [])
  const handleClick = (chooseTopic) => {
    const Items = data.find((dt) => dt.topic === chooseTopic);
    navigate(`/quiz/${Items.topicID}`);
  };
  const handleClear = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {data.map((topic) => {
          let currCache =
            JSON.parse(localStorage.getItem(`${topic.topic}`)) ?? {};
          const arr = Object.values(currCache);
          if (!_.isEmpty(arr) && _.findIndex(arr, { curr_ans: "" }) === -1) {
            return <Box key={topic.topic} display="none"></Box>;
          } else
            return (
              <Box
                as="button"
                onClick={() => handleClick(topic.topic)}
                key={topic.topic}
                bg="white"
                maxW="sm"
                borderWidth="1px"
                rounded="lg"
                shadow="lg"
              >
                <Image
                  src={topic.topicUrl}
                  alt={`Image-for-${topic.topic}`}
                  roundedTop="lg"
                />
                <Box
                  p="6"
                  mt="1"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                >
                  {topic.topic}
                </Box>
              </Box>
            );
        })}
      </SimpleGrid>
      <Flex justify="center" mt="15px">
        <Button onClick={handleClear}>Clear data</Button>
      </Flex>
    </Box>
  );
};

export default Home;
