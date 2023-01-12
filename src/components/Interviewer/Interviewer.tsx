import { Button, Card, Input } from 'antd';
import { FC } from 'react';
import { HandleUpdateInterview, Interview } from '../../hooks/useInterviewer';
import { ClearOutlined } from '@ant-design/icons';

interface InterviewerProps {
  interview: Interview[];
  handleUpdateInterview: HandleUpdateInterview;
  clearInterview: () => void;
}

const Interviewer: FC<InterviewerProps> = ({
  interview,
  handleUpdateInterview,
  clearInterview,
}) => {
  return (
    <Card
      // @ts-ignore
      align='left'
      title='Interviewer'
      style={{ width: '100%', marginBottom: 20 }}
      extra={
        <Button
          style={{
            background: 'red',
            width: 160,
          }}
          type='primary'
          onClick={clearInterview}
        >
          Clear <ClearOutlined />
        </Button>
      }
    >
      {interview.map((topic: Interview, index: number) => (
        <>
          <h4>{`${index + 1}. ${topic.question}`}</h4>
          <Input.TextArea
            style={{ height: '100%' }}
            autoSize
            placeholder={`Answer Question #${index + 1}`}
            onChange={(event) =>
              handleUpdateInterview({
                question: topic.question,
                answer: event.target.value,
                index,
              })
            }
            value={topic.answer}
          />
        </>
      ))}
    </Card>
  );
};

export default Interviewer;
