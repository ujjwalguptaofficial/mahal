1. Remove update timer on compoent destroy - done
2. Fix if if together issue - done

```
<div :if(dd)></div>
<div :if(ff)></div>
```
3. Allow tag without end .eg. - <br> - done
4. Add if component - 

```
<if :cond(name)>
</if>
<else-if>
</else-if>
```
5. Allow comment inside comment

6. Allow in-place inside for loop

7. Allow if on root element

8. Fix reactivity issue when using not symbol

```
<BulmaButton :if(!isSeen) class="button" @click="markAsSeen" :isLoading="isMarking" :disabled="isMarking">
		Mark as Seen
	</BulmaButton>
```