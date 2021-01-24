
import EmployeeUI from './EmployeeUI';
import ApproverUI from './ApproverUI';

const ContainerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
}
const FunctionalStyle = {
  border: '1px solid rgba(0, 0, 0, 1)',
  width: '45%',
  height: '90vh'
}

function App() {
  return (
    <div className="App">
      <h1>Camunda POC</h1>
      <div style={ContainerStyle}>
        <div style={FunctionalStyle}>
          <EmployeeUI/>
        </div>
        <div style={FunctionalStyle}>
          <h4> HR UI </h4>
          <ApproverUI/>
        </div>
      </div>
    </div>
  );
}

export default App;
