import {
  Flex,
  Image,
  Text,
  Button,
  Heading,
  Container,
  SimpleGrid,
  Stack
} from "@chakra-ui/react";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase"
import { onValue, ref } from "firebase/database";

const Quizz = () => {
  const { topicID } = useParams();
  const [options, setOptions] = useState();
  const [currQues, setCurrQues] = useState(0);
  const [selected, setSelected] = useState("");
  const [questions, setQuestions] = useState([]);
  const [chosenTopic, setChosenTopic] = useState("");
  const [data, setData] = useState({});
  const [isErrorComplete, setIsErrorComplete] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setOptions(questions && _.sampleSize(questions?.[currQues]?.answers, 4));
  }, [currQues, questions]);
  useEffect(() => {
    if (!_.isEmpty(topicID)) {
      onValue(ref(db), (snapshot) => {
        const dataquiz = snapshot.val()
        const Data = _.head(
          dataquiz.quizzs.filter((topic) => topic.topicID === +topicID)
        );
        setData(Data);
        if (!_.isEmpty(Data)) {
          setChosenTopic(Data.topic);
          let currCache =
            JSON.parse(localStorage.getItem(`${Data.topic}`)) ?? {};
          if (_.isEmpty(currCache)) {
            let newQues = _.sampleSize(Data.questions, 4);
            newQues = _.sortBy(newQues, [
              function (o) {
                return o.id;
              }
            ]);
            setQuestions(newQues);
            newQues.map((ques) => {
              _.set(currCache, `[${ques.id}].curr_ans`, "");
              return localStorage.setItem(
                `${Data.topic}`,
                JSON.stringify(currCache)
              );
            });
          } else {
            let newQues = [];
            Object.keys(currCache).map((id) => {
              return newQues.push(Data.questions[+id - 1]);
            });
            setQuestions(newQues);
          }
        } else {
          navigate("/");
        }
      })


    } else {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    let currCache = JSON.parse(localStorage.getItem(`${data.topic}`)) ?? {};
    let select = Object.values(currCache)[currQues]?.curr_ans;
    setSelected(select);
  }, [data, currQues]);
  const correctAnswer = questions[currQues]?.answers.find(
    (obj) => obj.correct === true
  ).answer;
  const handleSelect = (option) => {
    if (selected === option && selected === correctAnswer) return "green";
    else if (selected === option && selected !== correctAnswer) return "red";
    else if (option === correctAnswer) return "green";
  };
  const handleCheck = (option, ques) => {
    setSelected(option);
    let currCache = JSON.parse(localStorage.getItem(`${chosenTopic}`)) ?? {};
    _.set(currCache, `[${ques.id}].curr_ans`, option);
    localStorage.setItem(`${chosenTopic}`, JSON.stringify(currCache));
  };
  const handleNext = () => {
    if (!_.isEmpty(selected)) {
      setCurrQues(currQues + 1);
      setSelected("");
      setIsErrorComplete(false);
      if (currQues + 1 === questions.length) {
        navigate(`/result/${topicID}`);
      }
    } else setIsErrorComplete(true);
  };
  const handleQuit = () => {
    navigate("/");
  };
  return (
    <Container maxW={"5xl"} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Flex>
          <Image
            rounded={"md"}
            alt={"feature image"}
            src={questions[currQues]?.image}
            objectFit={"cover"}
          />
        </Flex>
        <Stack spacing={4}>
          <Heading>Chủ đề: {chosenTopic}</Heading>
          <Text
            textTransform={"uppercase"}
            color={"blue.400"}
            fontWeight={600}
            fontSize={"sm"}
            bg={"blue.50"}
            p={2}
            alignSelf={"flex-start"}
            rounded={"md"}
          >
            Question {currQues + 1} :
          </Text>
          <Heading size="lg">{questions[currQues]?.question}</Heading>
          <Stack spacing={4}>
            {isErrorComplete === true && _.isEmpty(selected) && (
              <Flex
                justify="center"
                align="center"
                borderRadius="md"
                bg="red"
                p={4}
                color="white"
                fontWeight="bold"
                fontSize="lg"
              >
                Hãy chọn một đáp án trước khi tiếp tục
              </Flex>
            )}
            {options &&
              options.map((option, index) => (
                <Button
                  colorScheme={
                    !_.isEmpty(selected) ? handleSelect(option.answer) : "gray"
                  }
                  key={index}
                  onClick={() =>
                    handleCheck(option.answer, questions[currQues])
                  }
                  isDisabled={!_.isEmpty(selected)}
                >
                  {option.answer}
                </Button>
              ))}
            <Stack direction="row">
              <Button w="100%" colorScheme="red" onClick={handleQuit}>
                Quit
              </Button>
              <Button w="100%" colorScheme="blue" onClick={handleNext}>
                {currQues + 1 === questions.length
                  ? "Hoàn thành"
                  : "Câu tiếp theo"}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default Quizz;
