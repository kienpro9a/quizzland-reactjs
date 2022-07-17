import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Image,
  Button
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import _ from "lodash";
import { db } from "../firebase"
import { onValue, ref } from "firebase/database";

const Result = () => {
  const { topicID } = useParams();
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  let newScore = 0;
  useEffect(() => {
    if (!_.isEmpty(topicID)) {
      onValue(ref(db), (snapshot) => {
        const dataquiz = snapshot.val()
        const Data = _.head(
          dataquiz.quizzs.filter((topic) => topic.topicID === +topicID)
        );
        if (!_.isEmpty(Data)) {
          let currCache =
            JSON.parse(localStorage.getItem(`${Data.topic}`)) ?? {};
          const mapdata = Data.questions
            .filter((dt) => {
              if (_.indexOf(Object.keys(currCache), `${dt.id}`) !== -1) {
                return dt;
              }
            })
            .map((dt) => dt.answers);
          mapdata.map((dta) =>
            dta.map((dtb) => {
              if (
                _.indexOf(
                  Object.values(currCache).map((dt) => dt.curr_ans),
                  dtb.answer
                ) !== -1 &&
                dtb.correct === true
              ) {
                newScore++;
                setScore(newScore);
              }
            })
          );
        } else {
          navigate("/");
        }
      })

    } else {
      navigate("/");
    }
  }, []);

  const handleClick = () => {
    navigate("/");
  };
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(https://www.isave.vn/wp-content/uploads/2020/01/Top-5-m%C3%B3n-qu%C3%A0-t%E1%BA%B7ng-c%C3%B4ng-ngh%E1%BB%87-n%C3%AAn-t%E1%BA%B7ng-v%C3%A0o-n%C4%83m-2020-1024x576.png)`,
            filter: "blur(15px)",
            zIndex: -1
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)"
            }
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={282}
            objectFit={"cover"}
            src={
              "https://www.isave.vn/wp-content/uploads/2020/01/Top-5-m%C3%B3n-qu%C3%A0-t%E1%BA%B7ng-c%C3%B4ng-ngh%E1%BB%87-n%C3%AAn-t%E1%BA%B7ng-v%C3%A0o-n%C4%83m-2020-1024x576.png"
            }
          />
        </Box>
        <Box pt={10} align={"center"}>
          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
            Số câu trả lời đúng : {score}
          </Heading>
        </Box>
        <Button onClick={handleClick} w="100%">
          Trở về trang đầu
        </Button>
      </Box>
    </Center>
  );
};

export default Result;
