import './App.css';

import {
  CopyOutlined,
  MailOutlined,
  ClearOutlined,
  PlayCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Slider,
  Space,
  Table,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import useApp from './App.hooks';
import { fallacyColumns, wordCount } from './App.logic';
import { SummaryTable, NewEmailPoint } from './components';

function App() {
  const {
    enableWordCount,
    error,
    fallacies,
    generateEmailResponse,
    generateFallacies,
    generateRootPrompt,
    generateSummary,
    handleChangeWordCount,
    handleCopy,
    handleFallacyFinderChange,
    handleSummaryResponsesChange,
    handleToggleWordCount,
    handleUpdateIsSendEmail,
    handleRemoveSendEmailPoint,
    sendEmailPoints,
    handleUpdateSendEmailPoints,
    handleAddNewSendEmailPoint,
    isSendEmail,
    includeFallacyFinder,
    includeSummaryResponses,
    loading,
    promptWordCount,
    rootPrompt,
    setRootPrompt,
    state,
    summary,
    updateState,
    updateSummaryRecord,
  } = useApp();

  return (
    <div className='App'>
      <header className='App-header'>
        <div style={{ display: 'flex', marginTop: 10 }}>
          <MailOutlined
            className='App-logo'
            style={{ marginRight: 25, marginTop: 5 }}
          />
          <div>HIM</div>
        </div>
      </header>
      <div className='App-body'>
        <h3 style={{ marginBottom: 0, marginTop: 10 }} className='Cool-font'>
          AI Email Composer
        </h3>
        <h4 style={{ marginTop: 10 }}>
          <i>For Difficult Conversations with High Conflict People</i>
        </h4>
        {isSendEmail ? (
          <Card
            // @ts-ignore
            align='left'
            title='Compose a New Email'
            style={{ width: '100%' }}
            extra={
              <Button
                style={{ marginBottom: 10, marginTop: 10 }}
                type='primary'
                onClick={handleUpdateIsSendEmail}
              >
                Reply to an Email <MailOutlined />
              </Button>
            }
          >
            <FormItem label='Sender' style={{ marginTop: 10, marginBottom: 5 }}>
              <Input
                style={{ marginLeft: 15, width: 200 }}
                placeholder='Sender Name Here'
                onChange={(event) =>
                  updateState({ ...state, sender: event.target.value })
                }
                value={state.sender}
              />
            </FormItem>
            <FormItem
              label='Receiver'
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              <Input
                placeholder='Receiver Name Here'
                style={{ marginLeft: 5, width: 200 }}
                onChange={(event) =>
                  updateState({ ...state, receiver: event.target.value })
                }
                value={state.receiver}
              />
            </FormItem>
            <h4>What points should this email make?</h4>
            <NewEmailPoint
              sendEmailPoints={sendEmailPoints}
              handleUpdateSendEmailPoints={handleUpdateSendEmailPoints}
              handleAddNewSendEmailPoint={handleAddNewSendEmailPoint}
              handleRemoveSendEmailPoint={handleRemoveSendEmailPoint}
            />
          </Card>
        ) : (
          <Card
            // @ts-ignore
            align='left'
            title='Compose a Response Email'
            style={{ width: '100%' }}
            extra={
              <Button
                style={{ marginBottom: 10, marginTop: 10 }}
                type='primary'
                onClick={handleUpdateIsSendEmail}
              >
                Compose a New Email <MailOutlined />
              </Button>
            }
          >
            <FormItem label='Sender' style={{ marginTop: 10, marginBottom: 5 }}>
              <Input
                style={{ marginLeft: 15, width: 200 }}
                placeholder='Sender Name Here'
                onChange={(event) =>
                  updateState({ ...state, sender: event.target.value })
                }
                value={state.sender}
              />
            </FormItem>
            <FormItem
              label='Receiver'
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              <Input
                placeholder='Receiver Name Here'
                style={{ marginLeft: 5, width: 200 }}
                onChange={(event) =>
                  updateState({ ...state, receiver: event.target.value })
                }
                value={state.receiver}
              />
            </FormItem>
            <h4>What email are we responding to?</h4>
            <Input.TextArea
              autoSize
              placeholder='Paste email here'
              onChange={(event) =>
                updateState({ ...state, email: event.target.value })
              }
              value={state.email}
            />
            <Button.Group>
              <Button
                style={{ marginBottom: 10, marginTop: 40, marginRight: 20 }}
                type='default'
                onClick={generateFallacies}
                loading={loading.fallacies}
              >
                Fallacy Finder {!loading.fallacies && <PlayCircleOutlined />}
              </Button>
              <Button
                style={{ marginBottom: 10, marginTop: 40 }}
                type='default'
                onClick={generateSummary}
                loading={loading.summary}
              >
                Summarizer {!loading.summary && <UnorderedListOutlined />}
              </Button>
            </Button.Group>
            {error !== '' && (
              <Space direction='vertical' style={{ width: '100%' }}>
                <Alert
                  message='Error! Please try again.'
                  description={error}
                  type='error'
                />
              </Space>
            )}
          </Card>
        )}
        <Card
          title={'Generate Prompt'}
          style={{
            width: '100%',
            marginTop: 30,
            marginBottom: state.emailResponse !== '' ? 0 : 50,
          }}
          // @ts-ignore
          align='left'
          extra={
            <Button
              style={{ marginTop: 20, marginBottom: 20 }}
              type='dashed'
              onClick={generateRootPrompt}
              loading={loading.rootPrompt}
            >
              Reset Prompt <ClearOutlined />
            </Button>
          }
        >
          {fallacies.length > 0 && !isSendEmail && (
            <Table
              style={{ width: '100%' }}
              pagination={false}
              dataSource={fallacies}
              columns={fallacyColumns}
            />
          )}
          {summary.length > 0 && (
            <SummaryTable data={summary} updateRecord={updateSummaryRecord} />
          )}
          <Checkbox
            checked={enableWordCount}
            onChange={handleToggleWordCount}
            style={{
              marginBottom: 15,
              marginTop:
                (fallacies.length > 0 && !isSendEmail) || summary.length > 0
                  ? 15
                  : 0,
            }}
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
          {!isSendEmail && (
            <>
              <Checkbox
                disabled={summary.length === 0}
                checked={includeSummaryResponses}
                onChange={handleSummaryResponsesChange}
                style={{ marginBottom: 15 }}
              >
                Include Summary Responses
              </Checkbox>
              <Checkbox
                disabled={fallacies.length === 0}
                checked={includeFallacyFinder}
                onChange={handleFallacyFinderChange}
                style={{ marginBottom: 15 }}
              >
                Include Fallacy Prompts
              </Checkbox>
            </>
          )}
          <Input.TextArea
            style={{ height: '100%' }}
            autoSize
            placeholder='Enter root prompt'
            onChange={(event) => setRootPrompt(event.target.value)}
            value={rootPrompt}
          />
          <Button
            style={{ marginBottom: 0, marginTop: 20 }}
            type='primary'
            onClick={generateEmailResponse}
            loading={loading.emailResponse}
          >
            Generate Email {!loading.emailResponse && <MailOutlined />}
          </Button>
        </Card>
        {state.emailResponse !== '' && (
          <Card
            // @ts-ignore
            align='left'
            title={`Response Email${
              state.emailResponse !== ''
                ? ' (' + wordCount(state.emailResponse) + 'words)'
                : ''
            }`}
            style={{ width: '100%', marginBottom: 100, marginTop: 30 }}
            extra={
              state.emailResponse !== '' && (
                <Button onClick={handleCopy}>
                  <CopyOutlined /> Copy
                </Button>
              )
            }
          >
            {fallacies.length > 0 && isSendEmail && (
              <Table
                style={{ width: '100%' }}
                pagination={false}
                dataSource={fallacies}
                columns={fallacyColumns}
              />
            )}
            <Input.TextArea
              disabled={state.emailResponse === ''}
              style={{ height: '100%' }}
              autoSize
              placeholder='Enter an email'
              onChange={(event) =>
                updateState({ ...state, emailResponse: event.target.value })
              }
              value={state.emailResponse}
            />
            {isSendEmail && state.emailResponse !== '' && (
              <>
                <Button
                  style={{ marginBottom: 10, marginTop: 40 }}
                  type='default'
                  onClick={generateFallacies}
                  loading={loading.fallacies}
                >
                  Fallacy Finder {!loading.fallacies && <PlayCircleOutlined />}
                </Button>
                {error !== '' && (
                  <Space direction='vertical' style={{ width: '100%' }}>
                    <Alert
                      message='Error! Please try again.'
                      description={error}
                      type='error'
                    />
                  </Space>
                )}
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;

{
  /* <ArrowDownOutlined style={{ marginTop: 50 }} />
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
          </Card> */
}

{
  /* @ts-ignore */
}
