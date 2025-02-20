// import React, { useState } from 'react';
// import { TextField, MenuItem, Select, FormControl, InputLabel, Button, FormControlLabel, Radio, RadioGroup, FormHelperText, InputAdornment } from '@mui/material';

// const SampleSpecForm = () => {
//   const [garmentType, setGarmentType] = useState('');
//   const [sizeRange, setSizeRange] = useState('');
//   const [useTemplate, setUseTemplate] = useState('true');
//   const [templateId, setTemplateId] = useState('');
//   const [style, setStyle] = useState(''); // New state for style
//   const [saving, setSaving] = useState(false);

//   // Simulate fetching options
//   const garmentTypes = [
//     { code: 'PSS', label: 'Pants/Shorts/Skirts' },
//     { code: 'OSS', label: 'Overalls/Shortalls/Skirtalls' },
//     { code: 'TDK', label: 'Tops/Dresses - Knits' },
//     { code: 'TDW', label: 'Tops/Dresses - Wovens' },
//   ];

//   const sizeRanges = [
//     { code: 'NUM_JUN', label: '1-19 (Junior Numerical)' },
//     { code: 'ALP_JUN', label: 'XS-XXL (Junior/Missy Alpha)' },
//     { code: 'NUM_PLS', label: '14-28 (Plus Numerical)' },
//     { code: 'ALP_PLS', label: '1X-4X (Plus Alpha)' },
//     { code: 'NUM_MIS', label: '0-16 (Missy Numerical)' },
//     { code: 'NUM_GRL', label: '7-16 (Girls Numerical)' },
//   ];

//   const templates = [
//     { _id: 'template1', name: 'Template 1' },
//     { _id: 'template2', name: 'Template 2' },
//   ];

//   const styles = [
//     { code: 'CASUAL', label: 'Casual' },
//     { code: 'SPORTY', label: 'Sporty' },
//     { code: 'FORMAL', label: 'Formal' },
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSaving(true);
//     // Add your form submission logic here
//     setSaving(false);
//   };

//   const handleReset = () => {
//     setGarmentType('');
//     setSizeRange('');
//     setUseTemplate('true');
//     setTemplateId('');
//     setStyle('');
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
//       <FormControl fullWidth margin="normal" required>
//         <InputLabel id="garmentTypeLabel">Garment Type</InputLabel>
//         <Select
//           labelId="garmentTypeLabel"
//           value={garmentType}
//           onChange={(e) => setGarmentType(e.target.value)}
//           label="Garment Type"
//           required
//         >
//           {garmentTypes.map((type) => (
//             <MenuItem key={type.code} value={type.code}>
//               {type.label}
//             </MenuItem>
//           ))}
//         </Select>
//         {!garmentType && <FormHelperText error>Required</FormHelperText>}
//       </FormControl>

//       <FormControl fullWidth margin="normal" required>
//         <InputLabel id="sizeRangeLabel">Size Range</InputLabel>
//         <Select
//           labelId="sizeRangeLabel"
//           value={sizeRange}
//           onChange={(e) => setSizeRange(e.target.value)}
//           label="Size Range"
//           required
//         >
//           {sizeRanges.map((range) => (
//             <MenuItem key={range.code} value={range.code}>
//               {range.label}
//             </MenuItem>
//           ))}
//         </Select>
//         {!sizeRange && <FormHelperText error>Required</FormHelperText>}
//       </FormControl>

//       <RadioGroup
//         row
//         value={useTemplate}
//         onChange={(e) => setUseTemplate(e.target.value)}
//         name="useTemplate"
//       >
//         <FormControlLabel value="true" control={<Radio />} label="New Template" />
//         <FormControlLabel value="false" control={<Radio />} label="Copy Spec" />
//       </RadioGroup>

//       {useTemplate === 'true' && (
//         <FormControl fullWidth margin="normal" required>
//           <InputLabel id="templateIdLabel">Template</InputLabel>
//           <Select
//             labelId="templateIdLabel"
//             value={templateId}
//             onChange={(e) => setTemplateId(e.target.value)}
//             label="Template"
//             required
//           >
//             {templates.map((template) => (
//               <MenuItem key={template._id} value={template._id}>
//                 {template.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {!templateId && <FormHelperText error>Required</FormHelperText>}
//         </FormControl>
//       )}

//       {useTemplate === 'false' && (
//         <FormControl fullWidth margin="normal" required>
//           <InputLabel id="styleLabel">Style</InputLabel>
//           <Select
//             labelId="styleLabel"
//             value={style}
//             onChange={(e) => setStyle(e.target.value)}
//             label="Style"
//             required
//           >
//             {styles.map((styleOption) => (
//               <MenuItem key={styleOption.code} value={styleOption.code}>
//                 {styleOption.label}
//               </MenuItem>
//             ))}
//           </Select>
//           {!style && <FormHelperText error>Required</FormHelperText>}
//         </FormControl>
//       )}

//       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
//         <Button variant="outlined" onClick={handleReset}>Reset</Button>
//         <Button
//           variant="contained"
//           color="primary"
//           type="submit"
//           disabled={saving}
//         >
//           {saving ? 'Saving...' : 'Add'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default SampleSpecForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios
import { TextField, MenuItem, Select, FormControl, InputLabel, Button, FormControlLabel, Radio, RadioGroup, FormHelperText } from '@mui/material';

const SampleSpecForm = () => {
  const [garmentType, setGarmentType] = useState('');
  const [sizeRange, setSizeRange] = useState('');
  const [useTemplate, setUseTemplate] = useState('true');
  const [templateId, setTemplateId] = useState('');
  const [style, setStyle] = useState('');
  const [garmentTypes, setGarmentTypes] = useState([]);  // Store garment types
  const [sizeRanges, setSizeRanges] = useState([]);      // Store size ranges
  const [styles, setStyles] = useState([                  // Static styles (you can replace this with API if needed)
    { code: 'CASUAL', label: 'Casual' },
    { code: 'SPORTY', label: 'Sporty' },
    { code: 'FORMAL', label: 'Formal' },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch garment types with Axios
    axios.get('/garment-type')
      .then(response => {
        setGarmentTypes(response.data);  // Assuming API returns an array of garment types
      })
      .catch(error => {
        console.error('Error fetching garment types:', error);
      });

    // Fetch size ranges with Axios
    axios.get('/api/size-range')
      .then(response => {
        setSizeRanges(response.data);  // Assuming API returns an array of size ranges
      })
      .catch(error => {
        console.error('Error fetching size ranges:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // Add your form submission logic here
    setSaving(false);
  };

  const handleReset = () => {
    setGarmentType('');
    setSizeRange('');
    setUseTemplate('true');
    setTemplateId('');
    setStyle('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500}}>
      <FormControl fullWidth margin="normal" required>
        <InputLabel id="garmentTypeLabel">Garment Type</InputLabel>
        <Select
          labelId="garmentTypeLabel"
          value={garmentType}
          onChange={(e) => setGarmentType(e.target.value)}
          label="Garment Type"
          required
        >
          {garmentTypes.length > 0 ? (
            garmentTypes.map((type) => (
              <MenuItem key={type.code} value={type.code}>
                {type.Garment_Type}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Garment Types Available</MenuItem>
          )}
        </Select>
        {!garmentType && <FormHelperText error>Required</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="sizeRangeLabel">Size Range</InputLabel>
        <Select
          labelId="sizeRangeLabel"
          value={sizeRange}
          onChange={(e) => setSizeRange(e.target.value)}
          label="Size Range"
          required
        >
          {sizeRanges.length > 0 ? (
            sizeRanges.map((range) => (
              <MenuItem key={range.code} value={range.code}>
                {range.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Size Ranges Available</MenuItem>
          )}
        </Select>
        {!sizeRange && <FormHelperText error>Required</FormHelperText>}
      </FormControl>

      <RadioGroup
        row
        value={useTemplate}
        onChange={(e) => setUseTemplate(e.target.value)}
        name="useTemplate"
      >
        <FormControlLabel value="true" control={<Radio />} label="New Template" />
        <FormControlLabel value="false" control={<Radio />} label="Copy Spec" />
      </RadioGroup>

      {useTemplate === 'true' && (
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="templateIdLabel">Template</InputLabel>
          <Select
            labelId="templateIdLabel"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            label="Template"
            required
          >
            {/* Simulate fetching templates here */}
            <MenuItem value="template1">Template 1</MenuItem>
            <MenuItem value="template2">Template 2</MenuItem>
          </Select>
          {!templateId && <FormHelperText error>Required</FormHelperText>}
        </FormControl>
      )}

      {useTemplate === 'false' && (
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="styleLabel">Style</InputLabel>
          <Select
            labelId="styleLabel"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            label="Style"
            required
          >
            {styles.map((styleOption) => (
              <MenuItem key={styleOption.code} value={styleOption.code}>
                {styleOption.label}
              </MenuItem>
            ))}
          </Select>
          {!style && <FormHelperText error>Required</FormHelperText>}
        </FormControl>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <Button variant="outlined" onClick={handleReset}>Reset</Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Add'}
        </Button>
      </div>
    </form>
  );
};

export default SampleSpecForm;
