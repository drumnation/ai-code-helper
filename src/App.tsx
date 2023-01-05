import './App.css';

import {
  CopyOutlined,
  DeleteOutlined,
  MailOutlined,
  PlayCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Input, Space, Table } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import useApp from './App.hooks';
import { fallacyColumns, wordCount } from './App.logic';
import { GeneratePrompt, NewEmailPoint } from './components';

function App() {
  const {
    enableWordCount,
    error,
    fallacies,
    generateEmailResponse,
    generateFallacies,
    generateRootPrompt,
    generateSummary,
    handleAddNewSendEmailPoint,
    handleChangeWordCount,
    handleClearSendEmailPoints,
    handleCopy,
    handleFallacyFinderChange,
    handleRemoveSendEmailPoint,
    handleSummaryResponsesChange,
    handleToggleFirm,
    handleToggleWordCount,
    handleUpdateIsSendEmail,
    handleUpdateSendEmailPoints,
    handleClearReplyToEmail,
    handleChangeSender,
    handleChangeReceiver,
    handleChangeReplyToEmail,
    includeFallacyFinder,
    includeSummaryResponses,
    isFirm,
    isSendEmail,
    loading,
    promptWordCount,
    rootPrompt,
    sendEmailPoints,
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
            style={{ marginRight: 15, marginTop: 5 }}
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
            title='New Email'
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
            <FormItem label='Sender' style={{ marginBottom: 5 }}>
              <Input
                style={{ marginLeft: 15, width: 200 }}
                placeholder='Sender Name Here'
                onChange={handleChangeSender}
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
                onChange={handleChangeReceiver}
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
            <Button
              style={{ marginTop: 20, background: 'red' }}
              type='primary'
              onClick={handleClearSendEmailPoints}
            >
              Clear <DeleteOutlined />
            </Button>
          </Card>
        ) : (
          <Card
            // @ts-ignore
            align='left'
            title='Reply'
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
            <FormItem label='Sender' style={{ marginBottom: 5 }}>
              <Input
                style={{ marginLeft: 15, width: 200 }}
                placeholder='Sender Name Here'
                onChange={handleChangeSender}
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
                onChange={handleChangeReceiver}
                value={state.receiver}
              />
            </FormItem>
            <h4>What email are we responding to?</h4>
            <Input.TextArea
              autoSize
              placeholder='Paste email here'
              onChange={handleChangeReplyToEmail}
              value={state.email}
            />
            <Button
              style={{ marginTop: 20, background: 'red' }}
              type='primary'
              onClick={handleClearReplyToEmail}
            >
              Clear <DeleteOutlined />
            </Button>
          </Card>
        )}

        <GeneratePrompt
          enableWordCount={enableWordCount}
          error={error}
          fallacies={fallacies}
          fallacyColumns={fallacyColumns}
          generateEmailResponse={generateEmailResponse}
          generateFallacies={generateFallacies}
          generateRootPrompt={generateRootPrompt}
          generateSummary={generateSummary}
          handleChangeWordCount={handleChangeWordCount}
          handleFallacyFinderChange={handleFallacyFinderChange}
          handleSummaryResponsesChange={handleSummaryResponsesChange}
          handleToggleFirm={handleToggleFirm}
          handleToggleWordCount={handleToggleWordCount}
          includeFallacyFinder={includeFallacyFinder}
          includeSummaryResponses={includeSummaryResponses}
          isFirm={isFirm}
          isSendEmail={isSendEmail}
          loading={loading}
          promptWordCount={promptWordCount}
          rootPrompt={rootPrompt}
          setRootPrompt={setRootPrompt}
          summary={summary}
          state={state}
          updateSummaryRecord={updateSummaryRecord}
        />

        {state.emailResponse !== '' && (
          <>
            <Card
              // @ts-ignore
              align='left'
              title={`Response Email${
                state.emailResponse !== ''
                  ? ' (' + wordCount(state.emailResponse) + ' words)'
                  : ''
              }`}
              bodyStyle={{ padding: 0 }}
              style={{ width: '100%', marginBottom: 20, marginTop: 20 }}
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
              <div style={{ padding: 16 }}>
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
                      style={{ marginBottom: 10, marginTop: 30, width: 160 }}
                      type='primary'
                      onClick={generateFallacies}
                      loading={loading.fallacies}
                    >
                      Fallacy Finder{' '}
                      {!loading.fallacies && <PlayCircleOutlined />}
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
              </div>
            </Card>
            <div style={{ height: 50 }} />
          </>
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
