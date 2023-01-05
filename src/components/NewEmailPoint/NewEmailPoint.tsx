import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';

function NewEmailPoint({
  handleUpdateSendEmailPoints,
  handleAddNewSendEmailPoint,
  handleRemoveSendEmailPoint,
  sendEmailPoints,
}) {
  return sendEmailPoints.map((point, index) => (
    <FormItem
      key={`Point #${index + 1}`}
      label={`Point #${index + 1}`}
      style={{
        marginTop: 5,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Input
          style={{ marginLeft: 10, flex: 1 }}
          placeholder={`Enter point #${index + 1}`}
          onChange={(event) =>
            handleUpdateSendEmailPoints({
              newPoint: event.target.value,
              index,
            })
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleAddNewSendEmailPoint({
                index,
                sendEmailPoints,
              });
            }
          }}
          value={point}
        />
        <div>
          <PlusCircleOutlined
            color='green'
            style={{ marginLeft: 15, color: 'green', fontSize: 30 }}
            onClick={() =>
              handleAddNewSendEmailPoint({
                index,
                sendEmailPoints,
              })
            }
          />
          <MinusCircleOutlined
            style={{ marginLeft: 15, color: 'lightgrey', fontSize: 30 }}
            onClick={() =>
              handleRemoveSendEmailPoint({
                index,
                sendEmailPoints,
              })
            }
          />
        </div>
      </div>
    </FormItem>
  ));
}

export default NewEmailPoint;
