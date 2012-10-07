/**
 * Options for each chart. 
 * cahnge the animation type, redline values etc
 * here.
 */

/*
 * MineloadPlugin options.
 * variables with 'm' are sourced from 
 * the mineload bukkit plugin.
 */

/*
 * This value is critical for minecraft servers to remain 20
 * low ticks per second are caused by excess load causing the main
 * thread in bukkit to slow down.
 */
var mTpsOptions =
{
  width: 420, 
  height: 140,
  max: 20,
  greenFrom: 18, 
  greenTo: 20,
  yellowFrom: 16, 
  yellowTo: 18,
  redFrom: 0, 
  redTo: 16,
  animation:{
    duration: 1000,
    easing: 'out'
  }
};

/**
 * The playercount / max players percentange gauge.
 * 
 */
var mPlayersOptions =
{
  width: 420, 
  height: 140,
  max: 100,
  greenFrom: 0, 
  greenTo: 80,
  yellowFrom: 80, 
  yellowTo: 90,
  redFrom: 90, 
  redTo: 100,
  animation:{
    duration: 1000,
    easing: 'out'
  }
};

/**
 * How much memory the Java virtual machine has used
 * in percent
 */
var mJvmOptions =
{
  width: 420, 
  height: 140,
  max: 100,
  greenFrom: 0, 
  greenTo: 60,
  yellowFrom: 60, 
  yellowTo: 90,
  redFrom: 90, 
  redTo: 100,
  animation:{
    duration: 1000,
    easing: 'out'
  }
};

/**
 * Linux related values here. 
 * These display the general performance of the linux
 * server hosting bukkit. They are obtained via special php
 * script designed for linux servers only.
 */

//CPU Load gauge
var sysLoadOptions = 
{
  width: 420, 
  height: 140,
  max: 5,
  greenFrom: 0, 
  greenTo: 0.5,
  yellowFrom: 0.5, 
  yellowTo: 1.5,
  redFrom: 1.5, 
  redTo: 5,
  animation:{
    duration: 1000,
    easing: 'out'
  }
};

//this is retrived from the linux method
//its the actual memory availble on the physicsl
//machine
var sysMemoryOptions =
{
  width: 420, 
  height: 140,
  max: 100,
  greenFrom: 0, 
  greenTo: 60,
  yellowFrom: 60, 
  yellowTo: 85,
  redFrom: 85, 
  redTo: 100,
  animation:{
    duration: 1000,
    easing: 'out'
  }
};

//the rate at which bytes are trasmitted.
//10000 = 10MB/s
var sysTxOptions =
{
  width: 420, 
  height: 140,
  max: 10000,
  redFrom: 6000, 
  redTo: 10000,
  animation:{
    duration: 1000,
    easing: 'out'
  }
};
//the rate at which bytes are recieved.
//10000 = 10MB/s
var sysRxOptions =
{
  width: 420, 
  height: 140,
  max: 10000,
  redFrom: 6000, 
  redTo: 10000,
  animation:{
    duration: 1000,
    easing: 'out'
  }
};

//the time it takes to get the playercount and motd
//from the minecraft server port. this is how the ping is
//calculated for players in the server selection list in mc.
var sysLatencyOptions =
{
  width: 420, 
  height: 140,
  max: 5,
  greenFrom: 0, 
  greenTo: 0.2,
  yellowFrom: 0.2, 
  yellowTo: 0.6,
  redFrom: 0.6, 
  redTo: 5,
  animation:{
    duration: 600,
    easing: 'out'
  }
};

