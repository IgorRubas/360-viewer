'use client';
import { useCallback } from 'react';

interface ShaderParams {
  exposure: number;
  contrast: number;
  saturation: number;
}

interface ShaderControlsProps {
  exposure: number;
  contrast: number;
  saturation: number;
  onChange: (params: ShaderParams) => void;
}

export function ShaderControls({
  exposure,
  contrast,
  saturation,
  onChange
}: ShaderControlsProps) {
  const handleChange = useCallback((key: keyof ShaderParams, value: number) => {
    onChange({ exposure, contrast, saturation, [key]: value });
  }, [exposure, contrast, saturation, onChange]);

  return (
    <div className="shader-panel">
      <div className="control-group">
        <label>Exposure</label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.05"
          value={exposure}
          onChange={(e) => handleChange('exposure', Number(e.target.value))}
        />
        <span>{exposure.toFixed(2)}</span>
      </div>
      
      <div className="control-group">
        <label>Contrast</label>
        <input
          type="range"
          min="0.5"
          max="2.5"
          step="0.05"
          value={contrast}
          onChange={(e) => handleChange('contrast', Number(e.target.value))}
        />
        <span>{contrast.toFixed(2)}</span>
      </div>
      
      <div className="control-group">
        <label>Saturation</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.05"
          value={saturation}
          onChange={(e) => handleChange('saturation', Number(e.target.value))}
        />
        <span>{saturation.toFixed(2)}</span>
      </div>
    </div>
  );
}
