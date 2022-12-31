import './App.css';
import logo from './logo.svg';

import { CopyOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, Slider, Table } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import useApp from './App.hooks';
import { fallacyColumns, wordCount } from './App.logic';
import { SummaryTable } from './components';

function App() {
  const {
    generateDebatePrompt,
    setRootPrompt,
    rootPrompt,
    summary,
    error,
    generateEmailResponse,
    generateExpertFeedback,
    generateRootPrompt,
    handleFallacyFinderChange,
    handleSummaryResponsesChange,
    includeFallacyFinder,
    includeSummaryResponses,
    loading,
    state,
    updateState,
    updateSummaryRecord,
    handleCopy,
    promptWordCount,
    handleChangeWordCount,
    enableWordCount,
    handleToggleWordCount,
  } = useApp();

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <div>HIM</div>
      </header>
      <div className='App-body'>
        <h3 className='Cool-font'>
          AI For Responding to High Conflict Individuals
        </h3>
        <Card
          // @ts-ignore
          align='left'
          title='Email to Reply To'
          style={{ width: '100%', marginTop: 20 }}
        >
          <FormItem label='Sender' style={{ marginTop: 10, marginBottom: 5 }}>
            <Input
              style={{ marginLeft: 10, width: '98%' }}
              placeholder='Sender'
              onChange={(event) =>
                updateState({ ...state, sender: event.target.value })
              }
              value={state.sender}
            />
          </FormItem>
          <FormItem label='Receiver' style={{ marginTop: 5, marginBottom: 10 }}>
            <Input
              placeholder='Receiver'
              onChange={(event) =>
                updateState({ ...state, receiver: event.target.value })
              }
              value={state.receiver}
            />
          </FormItem>
          <Input.TextArea
            autoSize
            placeholder='Enter email to respond to'
            onChange={(event) =>
              updateState({ ...state, email: event.target.value })
            }
            value={state.email}
          />

          <Button
            style={{ marginBottom: 10, marginTop: 20 }}
            type='primary'
            onClick={generateExpertFeedback}
            loading={loading.expertFeedback}
          >
            Generate Expert Feedback <SyncOutlined />
          </Button>
          <div style={{ color: 'red' }}>
            <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
              {error}
            </pre>
          </div>
        </Card>
        <h3 className='Cool-font'>Logical Fallacies</h3>
        <Table
          style={{ width: '100%' }}
          pagination={false}
          dataSource={state.invalidArguments}
          columns={fallacyColumns}
        />
        <h3 className='Cool-font'>Summarized Arguments</h3>
        <SummaryTable data={summary} updateRecord={updateSummaryRecord} />
        {/* <ArrowDownOutlined style={{ marginTop: 50 }} />
        <Button
          style={{ marginBottom: 50, marginTop: 50 }}
          type='primary'
          onClick={generateDebatePrompt}
          loading={loading.debatePrompt}
        >
          Generate Debate Prompt <SyncOutlined />
        </Button>
        <ArrowDownOutlined style={{ marginBottom: 50 }} />
        <Card
          title='One Sided Debate Argument'
          style={{ width: '100%' }}
          // @ts-ignore
          align='left'
        >
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
            {state.oneSidedArgument}
          </pre>
        </Card>
        <ArrowDownOutlined style={{ marginBottom: 50, marginTop: 50 }} />
        <Card
          title='Combination of Debater and Fallacy Finder'
          style={{ width: '100%' }}
          // @ts-ignore
          align='left'
        >
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
            {state.combinedKnowledge}
          </pre>
          </Card> */}

        {/* @ts-ignore */}
        <Card
          title='Root Prompt'
          style={{ width: '100%', marginTop: 100 }}
          // @ts-ignore
          align='left'
        >
          <Checkbox
            checked={enableWordCount}
            onChange={handleToggleWordCount}
            style={{ marginBottom: 15 }}
          >
            Enable Word Count
          </Checkbox>
          <Form.Item label='Word Count'>
            <Slider
              disabled={!enableWordCount}
              min={10}
              max={1000}
              step={1}
              tooltip={{ open: enableWordCount }}
              value={promptWordCount}
              onChange={handleChangeWordCount}
            />
          </Form.Item>
          <Checkbox
            checked={includeSummaryResponses}
            onChange={handleSummaryResponsesChange}
            style={{ marginBottom: 15 }}
          >
            Include Summary Responses
          </Checkbox>
          <Checkbox
            checked={includeFallacyFinder}
            onChange={handleFallacyFinderChange}
            style={{ marginBottom: 15 }}
          >
            Include Fallacy Prompts
          </Checkbox>
          <Input.TextArea
            style={{ height: '100%' }}
            autoSize
            placeholder='Enter root prompt'
            onChange={(event) => setRootPrompt(event.target.value)}
            value={rootPrompt}
          />
          <Button
            style={{ marginTop: 25 }}
            type='primary'
            onClick={generateRootPrompt}
            loading={loading.rootPrompt}
          >
            Regenerate Root Prompt <SyncOutlined />
          </Button>
        </Card>
        <Button
          style={{ marginBottom: 50, marginTop: 50 }}
          type='primary'
          onClick={generateEmailResponse}
          loading={loading.emailResponse}
        >
          Generate Email Response <SyncOutlined />
        </Button>
        <Card
          // @ts-ignore
          align='left'
          title={`Response Email (${wordCount(state.emailResponse)} words)`}
          style={{ width: '100%', marginBottom: 100 }}
          extra={
            <Button onClick={handleCopy}>
              <CopyOutlined /> Copy
            </Button>
          }
        >
          <Input.TextArea
            style={{ height: '100%' }}
            autoSize
            placeholder='Enter an email'
            onChange={(event) =>
              updateState({ ...state, emailResponse: event.target.value })
            }
            value={state.emailResponse}
          />
        </Card>
      </div>
    </div>
  );
}

export default App;
