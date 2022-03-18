import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { Button, Input } from '@mui/material';
import TableOriginal from './TableOriginal';
import TableDerived from './TableDerived';
import styled, { css } from 'styled-components';
import { Flex, BoxShadow } from '../../../styles/theme';

const Edit = () => {
  const navigate = useNavigate();
  // const tableRef = useRef(null);

  const [dataSetName, setDataSetName] = useState('');

  const dataOriginal = [
    {
      id: 0,
      originalname: 'LOS A',
      type: 'Number',
    },
    {
      id: 1,
      originalname: 'LOS B',
      type: 'String',
    },
    {
      id: 2,
      originalname: 'LOS C',
      type: 'Date',
    },
  ];

  const [checkedInputs, setCheckedInputs] = useState([]);

  const handleCheckbox = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
  };

  // const [isAllChecked, setIsAllChecked] = useState(false);

  const handleAllCheckbox = checked => {
    if (checked) {
      setCheckedInputs(new Array(...dataOriginal.map(({ id }) => id)));
      // setIsAllChecked(true);
    } else {
      setCheckedInputs([]);
      // setIsAllChecked(false);
    }
  };
  console.log(checkedInputs);

  const columnsOriginal = useMemo(
    () => [
      {
        name: 'check',
        label: (
          <Checkbox
            id="id"
            type="checkbox"
            onChange={e => {
              handleAllCheckbox(e.currentTarget.checked);
            }}
          />
        ),
      },
      {
        name: 'originalName',
        label: 'Original Name',
      },
      {
        name: 'name',
        label: 'Name',
      },
      {
        name: 'type',
        label: 'Type',
      },
    ],
    []
  );

  const [inputName, setInputName] = useState('');
  const handleOriginalData = e => {
    setInputName(e.target.value);
  };

  const columnsDerived = useMemo(
    () => [
      {
        name: 'check',
        label: <Checkbox type="checkbox" />,
      },
      {
        name: 'name',
        label: 'Name',
      },
      {
        name: 'datatype',
        label: 'Data Type',
      },
      {
        name: 'formula',
        label: 'Formula',
      },
      {
        name: 'generate',
        label: 'Generate',
      },
    ],
    []
  );

  const option1 = [
    { label: 'Select', value: 'select' },
    { label: 'Formula', value: 'formula' },
  ];
  const option2 = [
    { label: 'Select', value: 'select' },
    { label: 'Category', value: 'category' },
    { label: 'Range', value: 'range' },
  ];

  const [dataType, setDataType] = useState('select');
  const [formula, setFormula] = useState('select');
  const [derivedInputValues, setDerivedInputValues] = useState({});

  const handleDataType = useCallback(e => {
    // tableRef.current.focus();
    console.log(e.target.value);
    setDataType(e.target.value, [dataType]);
  });

  const handleFormula = e => {
    setFormula(e.target.value);
  };

  const handleSaveData = () => {
    setDerivedInputValues({
      ...derivedInputValues,
      dataSetName,
      inputName,
      dataType,
      formula,
    });
  };
  // console.log(derivedInputValues);

  const defaultRow = useMemo(
    () => [
      {
        check: <Checkbox type="checkbox" name="check" />,
        name: <NameInput type="text" name="nameInput" />,
        datatype: (
          <DataTypeDropdown
            options={[
              { label: 'Select', value: 'select' },
              { label: 'Number', value: 'number' },
              { label: 'Category', value: 'category' },
            ]}
            name="dataType"
            value={dataType}
            onChange={handleDataType}
          />
        ),
        formula: (
          <FormulaDropdown
            options={dataType === 'number' ? option1 : option2}
            name={formula}
            value={dataType}
            onChange={handleFormula}
          />
        ),
        generate: <GenerateButton>Generate</GenerateButton>,
      },
    ],
    [dataType, formula]
  );

  const [addedData, setAddedData] = useState(defaultRow);

  const clickAdd = () => {
    setAddedData([...addedData, ...defaultRow], [addedData]);
  };

  const dataDerived = useMemo(
    () => [...addedData],
    [dataType, formula, addedData]
  );

  // useEffect(() => {
  //   console.log('dataDerived', dataDerived);
  //   setDataDerived(dataDerived);
  // }, [dataType, formula, dataDerived]);

  const goToList = () => {
    navigate('/dataset');
  };

  return (
    <EditBody>
      <Heading1>Data Set Setting</Heading1>
      <DataSetInput
        name="DataSet"
        type="text"
        placeholder="New DataSet"
        onChange={e => setDataSetName(e.target.value)}
      />

      <PaddingDiv>
        <Heading2>Source API Input</Heading2>
        <SourceApiDiv>
          <P>Source API</P>
          <ApiInput
            name="SourceApi"
            type="text"
            placeholder="Api1"
            disabled={true}
          />
        </SourceApiDiv>
      </PaddingDiv>

      <PaddingDiv>
        <Heading2>Data Input</Heading2>
        <TableOriginal
          columns={columnsOriginal}
          data={dataOriginal}
          checkedInputs={checkedInputs}
          handleCheckbox={handleCheckbox}
          handleOriginalData={handleOriginalData}
          // handleAllCheckbox={handleAllCheckbox}
        />
      </PaddingDiv>

      <PaddingDiv>
        <Heading2>Derived Data Input</Heading2>
        {/* <form> */}
        <TableDerived columns={columnsDerived} data={dataDerived} />
        {/* </form> */}
        <Div700>
          <ButtonDiv>
            <CommonButton variant="contained" onClick={clickAdd}>
              Add
            </CommonButton>
            <CommonButton variant="contained">Delete</CommonButton>
          </ButtonDiv>
        </Div700>
      </PaddingDiv>

      <Div800>
        <ButtonDiv>
          <CommonButton variant="contained" onClick={goToList}>
            Cancel
          </CommonButton>
          <CommonButton
            variant="contained"
            onClick={
              handleSaveData
              // , goToList
            }
          >
            Apply
          </CommonButton>
        </ButtonDiv>
      </Div800>
    </EditBody>
  );
};

export default Edit;

const DataTypeDropdown = ({ value, options, onChange, ref }) => {
  return (
    <form>
      <Select value={value} onChange={onChange} disabled={false}>
        {options.map((option, idx) => (
          <option key={`${idx}+${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </form>
  );
};

const FormulaDropdown = props => {
  const { name, value, options, onChange } = props;
  return (
    <form>
      <Select value={name} onChange={onChange} disabled={value === 'select'}>
        {options.map((option, idx) => (
          <option key={`${idx}+${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </form>
  );
};

const EditBody = styled.div`
  position: relative;
  padding-left: 20%;
`;

const Heading1 = styled.h1`
  font-size: 24px;
  font-weight: bold;
  padding: 10px 0;
`;

const DataSetInput = styled(Input)`
  width: 240px;
  height: 40px;
  padding-left: 10px;
`;

const PaddingDiv = styled.div`
  padding: 16px 0;
`;

const Heading2 = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 14px;
`;

const SourceApiDiv = styled.div`
  ${Flex}
  justify-content: space-around;
  width: 480px;
  height: 58px;
  ${BoxShadow}
`;

const P = styled.p`
  width: 120px;
`;

const ApiInput = styled.input`
  width: 200px;
  height: 34px;
  padding-left: 10px;
`;

// const DataInputTable = styled(MUIDataTable)`
//   width: 540px;
// `;

// const DataInputName = styled.input`
//   width: 120px;
//   height: 34px;
//   padding-left: 6px;
// `;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
`;

const NameInput = styled.input`
  width: 160px;
  height: 36px;
  font-size: 18px;
`;

const Select = styled.select`
  width: 140px;
  height: 36px;
  padding-left: 7px;
`;

const CommonButton = styled.button`
  width: 120px;
  height: 48px;
  margin-left: 16px;
  font-size: 16px;
  background-color: dodgerblue;
  color: white;
  border: none;
  border-radius: 5px;

  &:disabled {
    opacity: 0.6;
  }

  &:hover {
    cursor: pointer;
  }
`;

// const FlexDiv = styled.div`
//   ${Flex}
//   justify-content: space-between;
//   width: 260px;
// `;

const Generate = css`
  background-color: skyblue;
  border: 1px solid rgb(118, 118, 118);
  ${BoxShadow}
`;

const GenerateButton = styled(Button)`
  width: 130px;
  height: 36px;
  ${Generate}

  &:disabled {
    opacity: 0.5;
  }
`;

const Div700 = styled.div`
  ${Flex}
  justify-content: flex-end;
  width: 700px;
  height: 100px;
`;

const Div800 = styled.div`
  ${Flex}
  justify-content: flex-end;
  width: 800px;
  height: 100px;
`;

const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 250px;
  padding: 36px 0px;
`;

// const CommonButton = styled(Button)`
//   width: 110px;
//   height: 50px;
//   margin: 10px;
// `;
