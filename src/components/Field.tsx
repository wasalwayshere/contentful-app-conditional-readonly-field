import React, { useEffect, useState } from 'react'
import { TextInput } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';


interface FieldProps {
  sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {

  const [value, setValue] = useState(props.sdk.field.getValue() || []);
  const [publishCount, setPublishCount] = useState(props.sdk.entry.getSys().publishedCounter);

  const handleObjectUpdate = ((sys: any) => {
    if (sys) {
      setPublishCount(sys.publishedCounter);
    }
  });

  useEffect(() => {
    props.sdk.window.startAutoResizer(); // use contentful's builtin auto-resizer
    props.sdk.entry.onSysChanged(handleObjectUpdate); // update publishCount
  });

  // external change
  useEffect(() => {
    const detachExternalChangeHandler = () => props.sdk.field.onValueChanged(setValue)
  });

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    // console.log(value);
    setValue( value );
    if (value) {
      await props.sdk.field.setValue(value)
          .then((data) => {
            // console.log(data);  // do something else
          });
    } else {
      await props.sdk.field.removeValue();
    }
  }

  return (
      <TextInput
          width="large"
          type="text"
          id="my-field"
          testId="my-field"
          value={value}
          onChange={onChange}
          readOnly={publishCount > 0 ? true : false}
      />
  );

};

export default Field;