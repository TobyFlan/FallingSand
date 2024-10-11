import { useApp } from '@pixi/react'
import run from './SandPixi'

import { useEffect } from 'react'

export default function SandApp() {
  const app = useApp();

  useEffect(() => {
    app.stage.removeChildren();
    run(app);
  }, [app]);

  return (
    <></>
  )
}